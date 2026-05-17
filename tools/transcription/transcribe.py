from __future__ import annotations

import argparse
import json
import re
import sys
import wave
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable, Sequence


@dataclass(frozen=True)
class TranscriptEntry:
    index: int
    start: float
    end: float
    text: str
    confidence: str


TERMINAL_PUNCTUATION = re.compile(r"[.!?。！？…]+$")


def split_script_sentences(script: str) -> list[str]:
    sentences: list[str] = []
    for raw_line in script.splitlines():
        line = raw_line.strip()
        if not line or line == "---":
            continue
        if line.startswith("#") or line.startswith("["):
            continue
        line = re.sub(r"^\s*[-*]\s+", "", line)
        line = line.strip(" >")
        if line:
            sentences.append(line)
    return sentences


def format_srt_timestamp(seconds: float) -> str:
    total_ms = max(0, round(seconds * 1000))
    hours, remainder = divmod(total_ms, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def build_estimated_timeline(sentences: Sequence[str], duration: float) -> list[TranscriptEntry]:
    clean_sentences = [sentence.strip() for sentence in sentences if sentence.strip()]
    if not clean_sentences:
        raise ValueError("script has no usable sentences")
    if duration <= 0:
        raise ValueError("duration must be greater than zero")

    weights = [max(1, len(sentence)) for sentence in clean_sentences]
    total_weight = sum(weights)
    entries: list[TranscriptEntry] = []
    current = 0.0

    for index, (sentence, weight) in enumerate(zip(clean_sentences, weights), start=1):
        if index == len(clean_sentences):
            end = duration
        else:
            end = current + (duration * weight / total_weight)
        entries.append(
            TranscriptEntry(
                index=index,
                start=round(current, 3),
                end=round(end, 3),
                text=sentence,
                confidence="estimated",
            )
        )
        current = end

    return entries


def entries_from_segments(segments: Iterable[object], pause_threshold: float = 0.45) -> list[TranscriptEntry]:
    entries: list[TranscriptEntry] = []

    for segment in segments:
        words = getattr(segment, "words", None)
        if words:
            entries.extend(_entries_from_words(words, start_index=len(entries) + 1, pause_threshold=pause_threshold))
            continue
        entries.extend(
            _entries_from_segment_text(
                str(getattr(segment, "text", "")),
                float(getattr(segment, "start", 0.0)),
                float(getattr(segment, "end", 0.0)),
                start_index=len(entries) + 1,
            )
        )

    return entries


def _entries_from_words(
    words: Sequence[object],
    *,
    start_index: int,
    pause_threshold: float,
) -> list[TranscriptEntry]:
    entries: list[TranscriptEntry] = []
    buffer: list[str] = []
    current_start: float | None = None

    def flush(end: float) -> None:
        nonlocal buffer, current_start
        text = " ".join(buffer).strip()
        if text and current_start is not None:
            entries.append(
                TranscriptEntry(
                    index=start_index + len(entries),
                    start=round(current_start, 3),
                    end=round(end, 3),
                    text=text,
                    confidence="local",
                )
            )
        buffer = []
        current_start = None

    for position, word in enumerate(words):
        text = str(getattr(word, "word", "")).strip()
        if not text:
            continue
        word_start = float(getattr(word, "start", 0.0))
        word_end = float(getattr(word, "end", word_start))
        if current_start is None:
            current_start = word_start
        buffer.append(text)

        next_word = words[position + 1] if position + 1 < len(words) else None
        next_start = float(getattr(next_word, "start", word_end)) if next_word else None
        pause = (next_start - word_end) if next_start is not None else 0.0
        compact_text = "".join(buffer).replace(" ", "")
        punctuation_boundary = bool(TERMINAL_PUNCTUATION.search(text))
        pause_boundary = next_word is not None and pause >= pause_threshold and len(compact_text) >= 5

        if punctuation_boundary or pause_boundary:
            flush(word_end)

    if buffer:
        final_end = float(getattr(words[-1], "end", current_start or 0.0))
        flush(final_end)

    return entries


def _entries_from_segment_text(text: str, start: float, end: float, *, start_index: int) -> list[TranscriptEntry]:
    clean_text = " ".join(text.strip().split())
    if not clean_text:
        return []
    parts = [part.strip() for part in re.findall(r".+?(?:[.!?。！？…]+|$)", clean_text) if part.strip()]
    if len(parts) <= 1:
        return [
            TranscriptEntry(
                index=start_index,
                start=round(start, 3),
                end=round(end, 3),
                text=clean_text,
                confidence="local",
            )
        ]

    duration = max(0.0, end - start)
    weights = [max(1, len(part)) for part in parts]
    total_weight = sum(weights)
    entries: list[TranscriptEntry] = []
    current = start
    for offset, (part, weight) in enumerate(zip(parts, weights)):
        part_end = end if offset == len(parts) - 1 else current + duration * weight / total_weight
        entries.append(
            TranscriptEntry(
                index=start_index + offset,
                start=round(current, 3),
                end=round(part_end, 3),
                text=part,
                confidence="local",
            )
        )
        current = part_end
    return entries


def audio_duration_seconds(audio_path: Path) -> float:
    with wave.open(str(audio_path), "rb") as audio:
        frames = audio.getnframes()
        rate = audio.getframerate()
    return frames / float(rate)


def write_outputs(
    entries: Sequence[TranscriptEntry],
    out_dir: Path,
    *,
    engine: str,
    language: str,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "engine": engine,
        "language": language,
        "sentence_count": len(entries),
        "sentences": [asdict(entry) for entry in entries],
    }

    timeline_text = json.dumps(payload, ensure_ascii=False, indent=2)
    (out_dir / "sentences.json").write_text(timeline_text + "\n", encoding="utf-8")
    (out_dir / "timeline.json").write_text(timeline_text + "\n", encoding="utf-8")
    (out_dir / "subtitles.srt").write_text(render_srt(entries), encoding="utf-8")
    (out_dir / "README.md").write_text(render_summary(entries, engine, language), encoding="utf-8")


def render_srt(entries: Sequence[TranscriptEntry]) -> str:
    blocks = []
    for entry in entries:
        blocks.append(
            "\n".join(
                [
                    str(entry.index),
                    f"{format_srt_timestamp(entry.start)} --> {format_srt_timestamp(entry.end)}",
                    entry.text,
                ]
            )
        )
    return "\n\n".join(blocks) + "\n"


def render_summary(entries: Sequence[TranscriptEntry], engine: str, language: str) -> str:
    quality_note = (
        "로컬 전사 결과입니다."
        if engine != "estimated-script"
        else "주의: 실제 전사가 아니라 스크립트 길이 기반 추정 타임라인입니다. 최종 영상 싱크 기준으로 단독 사용하지 마세요."
    )
    return "\n".join(
        [
            "# Transcript Timeline",
            "",
            f"- Engine: `{engine}`",
            f"- Language: `{language}`",
            f"- Sentence count: `{len(entries)}`",
            f"- Quality: {quality_note}",
            "",
            "## Files",
            "",
            "- `sentences.json`: Remotion/HyperFrames에서 읽을 문장별 타임코드",
            "- `timeline.json`: `sentences.json`과 같은 내용의 호환 파일",
            "- `subtitles.srt`: 검수용 자막 파일",
            "",
        ]
    )


def transcribe_with_faster_whisper(
    audio_path: Path,
    *,
    language: str,
    model_size: str,
    device: str,
    compute_type: str,
) -> list[TranscriptEntry]:
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise RuntimeError("faster-whisper is not installed") from exc

    model_kwargs = {}
    if device != "auto":
        model_kwargs["device"] = device
    if compute_type != "auto":
        model_kwargs["compute_type"] = compute_type

    model = WhisperModel(model_size, **model_kwargs)
    segments, _info = model.transcribe(
        str(audio_path),
        language=language,
        vad_filter=True,
        beam_size=5,
        word_timestamps=True,
    )
    entries = entries_from_segments(segments)
    if not entries:
        raise RuntimeError("faster-whisper returned no transcript segments")
    return entries


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Create local sentence timestamps for Remotion/HyperFrames video projects."
    )
    parser.add_argument("--audio", type=Path, help="Path to voiceover.wav")
    parser.add_argument("--script", type=Path, help="Optional script text for estimated fallback")
    parser.add_argument("--out", type=Path, default=Path("transcript"), help="Output directory")
    parser.add_argument("--language", default="ko", help="BCP-47/Whisper language code")
    parser.add_argument("--model", default="small", help="faster-whisper model size or local model path")
    parser.add_argument("--device", default="auto", choices=["auto", "cpu", "cuda"], help="Inference device")
    parser.add_argument("--compute-type", default="auto", help="faster-whisper compute type")
    parser.add_argument(
        "--allow-estimated",
        action="store_true",
        help="Create a clearly marked script-length estimate if local STT is unavailable",
    )
    parser.add_argument("--check", action="store_true", help="Print local engine availability and exit")
    return parser


def check_local_engine() -> int:
    try:
        import faster_whisper  # noqa: F401
    except ImportError:
        print("faster-whisper: not installed")
        print("Install: python -m pip install -r tools/transcription/requirements.txt")
        return 1
    print("faster-whisper: installed")
    return 0


def main(argv: Iterable[str] | None = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.check:
        return check_local_engine()

    if not args.audio:
        parser.error("--audio is required unless --check is used")
    if not args.audio.exists():
        parser.error(f"audio file not found: {args.audio}")

    try:
        entries = transcribe_with_faster_whisper(
            args.audio,
            language=args.language,
            model_size=args.model,
            device=args.device,
            compute_type=args.compute_type,
        )
        write_outputs(entries, args.out, engine="faster-whisper", language=args.language)
        print(f"Wrote local transcript timeline to {args.out}")
        return 0
    except RuntimeError as exc:
        if not args.allow_estimated:
            print(str(exc), file=sys.stderr)
            print(
                "Local STT is required for final sync. Install faster-whisper or provide SRT/VTT/timeline JSON.",
                file=sys.stderr,
            )
            print(
                "Install command: python -m pip install -r tools/transcription/requirements.txt",
                file=sys.stderr,
            )
            return 2

        if not args.script or not args.script.exists():
            print("--allow-estimated requires --script with an existing text file", file=sys.stderr)
            return 2
        script = args.script.read_text(encoding="utf-8")
        sentences = split_script_sentences(script)
        entries = build_estimated_timeline(sentences, audio_duration_seconds(args.audio))
        write_outputs(entries, args.out, engine="estimated-script", language=args.language)
        print(f"Wrote estimated transcript timeline to {args.out}")
        print("WARNING: This is not an exact transcription timeline. Use only for draft layout.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
