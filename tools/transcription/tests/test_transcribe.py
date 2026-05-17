import json
import unittest
from pathlib import Path

from transcribe import (
    TranscriptEntry,
    build_estimated_timeline,
    entries_from_segments,
    format_srt_timestamp,
    split_script_sentences,
    write_outputs,
)


class FakeWord:
    def __init__(self, start, end, word):
        self.start = start
        self.end = end
        self.word = word


class FakeSegment:
    def __init__(self, start, end, text, words=None):
        self.start = start
        self.end = end
        self.text = text
        self.words = words


class TranscriptionToolTest(unittest.TestCase):
    def test_split_script_sentences_keeps_korean_question_sentences(self):
        script = """
        직장인 여러분,

        에이아이로 피피티 만들어보신 적 있으시죠?

        그런데 솔직히 어떠셨나요?
        오, 깔끔하긴 한데
        발표자료로 쓰긴 애매한데?
        """

        self.assertEqual(
            split_script_sentences(script),
            [
                "직장인 여러분,",
                "에이아이로 피피티 만들어보신 적 있으시죠?",
                "그런데 솔직히 어떠셨나요?",
                "오, 깔끔하긴 한데",
                "발표자료로 쓰긴 애매한데?",
            ],
        )

    def test_build_estimated_timeline_covers_full_duration_without_overlap(self):
        entries = build_estimated_timeline(["짧은 문장", "조금 더 긴 문장입니다"], 12.0)

        self.assertAlmostEqual(entries[0].start, 0.0)
        self.assertAlmostEqual(entries[-1].end, 12.0)
        self.assertLessEqual(entries[0].end, entries[1].start)
        self.assertEqual([entry.index for entry in entries], [1, 2])
        self.assertTrue(all(entry.confidence == "estimated" for entry in entries))

    def test_write_outputs_creates_json_srt_and_summary(self):
        import tempfile

        entries = [
            TranscriptEntry(index=1, start=0.0, end=1.5, text="첫 문장입니다.", confidence="local"),
            TranscriptEntry(index=2, start=1.5, end=3.0, text="두 번째 문장입니다.", confidence="local"),
        ]

        with tempfile.TemporaryDirectory() as tmp:
            out_dir = Path(tmp)
            write_outputs(entries, out_dir, engine="faster-whisper", language="ko")

            timeline = json.loads((out_dir / "sentences.json").read_text(encoding="utf-8"))
            self.assertEqual(timeline["engine"], "faster-whisper")
            self.assertEqual(timeline["language"], "ko")
            self.assertEqual(timeline["sentences"][1]["text"], "두 번째 문장입니다.")

            srt = (out_dir / "subtitles.srt").read_text(encoding="utf-8")
            self.assertIn("00:00:00,000 --> 00:00:01,500", srt)
            self.assertIn("첫 문장입니다.", srt)

            summary = (out_dir / "README.md").read_text(encoding="utf-8")
            self.assertIn("faster-whisper", summary)

    def test_format_srt_timestamp_rounds_milliseconds(self):
        self.assertEqual(format_srt_timestamp(65.4321), "00:01:05,432")

    def test_entries_from_segments_split_by_punctuation_and_pause(self):
        segments = [
            FakeSegment(
                0.0,
                5.0,
                "첫 문장입니다. 두 번째 문장입니다 다음 구간",
                [
                    FakeWord(0.0, 0.7, "첫"),
                    FakeWord(0.7, 1.4, "문장입니다."),
                    FakeWord(1.5, 2.2, "두"),
                    FakeWord(2.2, 3.0, "번째"),
                    FakeWord(3.0, 3.4, "문장입니다"),
                    FakeWord(4.0, 4.5, "다음"),
                    FakeWord(4.5, 5.0, "구간"),
                ],
            )
        ]

        entries = entries_from_segments(segments)

        self.assertEqual([entry.text for entry in entries], ["첫 문장입니다.", "두 번째 문장입니다", "다음 구간"])
        self.assertEqual([entry.index for entry in entries], [1, 2, 3])
        self.assertAlmostEqual(entries[1].start, 1.5)
        self.assertAlmostEqual(entries[1].end, 3.4)


if __name__ == "__main__":
    unittest.main()
