# Workflows

## 2026-05-17 - Audio-to-scene sync calibration

1. Treat the task-root `voiceover.wav` as the timing source of truth.
2. Run loudness/silence analysis first, but do not use silence alone as proof of semantic sync.
3. For exact sentence or scene sync, create or request a timecoded transcript/forced-alignment output.
4. Generate Remotion scene starts and text overlay starts from that timestamp table, then set visual animations to begin at or slightly before the corresponding spoken phrase.
5. Verify by rendering a debug pass with frame/time/scene markers plus boundary stills before rendering the final MP4.
6. Prefer root `tools/transcription/transcribe.py` for local transcription. Use `<task>/transcript/sentences.json` as the source of truth for video timing.
7. If local transcription dependencies are missing, install `tools/transcription/requirements.txt` inside root `tools/transcription/.venv` or request user-provided SRT/VTT/timeline JSON. External STT requires explicit approval.
8. Treat `--allow-estimated` output as draft-only unless the user explicitly accepts estimated timing.
9. Cover silent gaps between timestamped sentences with the previous visual scene, never with the final scene fallback.
10. Keep timecode/progress/frame debug overlays out of final MP4 renders; use them only for review frames or debug compositions.

반복해서 사용할 작업 절차를 기록합니다.

## 스크립트 기반 모션그래픽

1. 루트 `DESIGN.md`와 `AGENTS.md`를 확인합니다.
2. 음성 파일이 있는지 확인합니다. 없으면 사용자에게 요청합니다.
3. `YYYYMMDD_작업제목` 폴더를 만들고 하위 폴더를 구성합니다.
4. 음성 원본 파일을 작업 폴더 루트의 `voiceover.wav`로 둡니다.
5. 음성 길이를 확인합니다.
6. 스크립트를 장면 단위 타임라인으로 나눕니다.
7. 장면마다 핵심 메시지, 인포그래픽 구조, 텍스트 라벨을 정합니다.
8. Remotion 또는 HyperFrames로 구현합니다.
9. 대표 프레임을 `review-frames/`에 렌더링해 텍스트 겹침과 타이밍을 확인합니다.
10. 싱크 불일치가 있으면 전체 타임라인을 1초 단위와 장면 전환 전후 프레임으로 샘플링하고 컨택트 시트를 만들어 확인합니다.
11. 최종 MP4를 `outputs/`에 렌더링합니다.
12. 비디오와 오디오 트랙 포함 여부를 확인합니다.

## Codex Desktop video plugins

1. Remotion과 HyperFrames는 Codex Desktop 플러그인/스킬을 작업 보조 도구로 사용합니다.
2. 실제 렌더는 작업 폴더 안의 코드와 로컬 Node/FFmpeg/전사 의존성으로 수행합니다.
3. 새 작업 프롬프트에는 영상 목적, 화면비, 길이, 음성 파일 경로, 대본, 원하는 도구(Remotion 또는 HyperFrames), 디자인 기준(`DESIGN.md` 우선), 출력 파일명을 포함합니다.
4. Remotion은 React/TypeScript 컴포지션을 작성해 `npx.cmd remotion render`로 MP4를 만듭니다.
5. HyperFrames는 HTML/CSS/GSAP 컴포지션을 작성해 `npx.cmd hyperframes render`로 MP4를 만듭니다.

## Git ignore policy

1. GitHub에는 작업 소스, 공통 문서, 도구 스크립트, 재현에 필요한 설정 파일을 올립니다.
2. 날짜형 작업 폴더(`YYYYMMDD_작업제목/`)는 개별 로컬 작업공간으로 보고 기본적으로 Git 추적 대상에서 제외합니다.
3. `outputs/`, `review-frames/`, `voiceover.*`, `transcript/`, `node_modules/`, `.venv/`, 캐시와 로그도 Git 추적 대상에서 제외합니다.
4. 이미 추적 중인 작업 폴더나 산출물은 `.gitignore`만으로 빠지지 않으므로 필요하면 `git rm --cached`로 인덱스에서만 제거합니다.

## README audience

1. 루트 `README.md`는 GitHub 방문자가 처음 읽는 문서이므로 Codex Desktop에서 자연어로 요청하는 흐름을 먼저 설명합니다.
2. 터미널 명령어는 필수 절차처럼 앞세우지 않고, 설치 확인이나 문제 해결용 참고 섹션에 둡니다.
3. 사용자가 직접 실행할 명령보다 Codex에게 전달할 프롬프트 예시를 우선합니다.
