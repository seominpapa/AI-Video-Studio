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
2. 초기 영상 생성 요청에는 음성 파일과 스크립트 파일을 함께 첨부하도록 안내합니다. 둘 중 하나라도 없으면 제작 전에 사용자에게 추가 요청합니다.
3. `YYYYMMDD_작업제목` 폴더를 만들고 하위 폴더를 구성합니다. 스크립트 파일용 `script/`와 서브에이전트 지시가 필요할 때의 `agent-briefs/`도 함께 만듭니다.
4. 음성 원본 파일을 작업 폴더 루트의 `voiceover.wav`로 둡니다.
5. 첨부 스크립트 파일을 `script/` 안으로 옮기고, `script/narration-script.txt` 정리본을 만듭니다.
6. 정리본은 마크다운, 코드 블록, 촬영 메모, `[화면 예시]` 같은 화면 전용 요소를 제거하고, 영어와 숫자는 한국어 발음/표기로 바꾸며, 대시는 삭제하고 화살표는 쉼표로 바꿉니다.
7. 정리본은 한 줄이 한 호흡이 되도록 약 20자 초과 줄을 의미 단위와 쉼표 위치에서 나누고, 모든 줄 뒤에 빈 줄을 둡니다.
8. 음성 길이를 확인합니다.
9. 스크립트를 장면 단위 타임라인으로 나눕니다.
10. 장면마다 핵심 메시지, 인포그래픽 구조, 텍스트 라벨을 정합니다.
11. Remotion 또는 HyperFrames로 구현합니다.
12. 대표 프레임을 `review-frames/`에 렌더링해 텍스트 겹침과 타이밍을 확인합니다.
13. 싱크 불일치가 있으면 전체 타임라인을 1초 단위와 장면 전환 전후 프레임으로 샘플링하고 컨택트 시트를 만들어 확인합니다.
14. 최종 MP4를 `outputs/`에 렌더링합니다.
15. 비디오와 오디오 트랙 포함 여부를 확인합니다.

## Codex Desktop video plugins

1. Remotion과 HyperFrames는 Codex Desktop 플러그인/스킬을 작업 보조 도구로 사용합니다.
2. 실제 렌더는 작업 폴더 안의 코드와 로컬 Node/FFmpeg/전사 의존성으로 수행합니다.
3. 새 작업 프롬프트에는 영상 목적, 화면비, 길이, 첨부 음성 파일, 첨부 스크립트 파일, 원하는 도구(Remotion 또는 HyperFrames), 디자인 기준(`DESIGN.md` 우선), 출력 파일명을 포함합니다.
4. Remotion은 React/TypeScript 컴포지션을 작성해 `npx.cmd remotion render`로 MP4를 만듭니다.
5. HyperFrames는 HTML/CSS/GSAP 컴포지션을 작성해 `npx.cmd hyperframes render`로 MP4를 만듭니다.

## Subagent video production

1. Orchestrator가 사용자 요구사항, 도구 선택, 작업 폴더, 공통 타임라인, 디자인 방향, QA 수정 우선순위, 최종 렌더 승인 여부를 결정합니다.
2. Intake/Sync Agent가 음성 길이, 로컬 전사, `transcript/sentences.json`, 장면 타임라인 표를 만듭니다.
3. Design Agent가 `DESIGN.md` 기준 비주얼 시스템, 안전 영역, 인포그래픽 구조, 텍스트 밀도, 장면별 디자인 브리프를 만듭니다. 공통 스타일 설계는 Sync와 병렬 가능하지만 장면별 정확한 타이밍은 타임라인 승인 뒤 확정합니다.
4. 사용자가 Remotion을 요구하면 Remotion Agent만 `remotion-project/`를 담당합니다.
5. 사용자가 HyperFrames를 요구하면 HyperFrames Agent만 `source-hyperframes/`를 담당합니다.
6. 사용자가 두 도구 비교 제작을 요청하면 Remotion Agent와 HyperFrames Agent를 병렬로 실행할 수 있습니다.
7. QA Agent는 샘플 프레임 목록, 텍스트 겹침, 장면 싱크, 디버그 UI 제거, 오디오 트랙 포함 여부를 검수합니다. 검수 계획은 구현과 병렬로 준비하고, 최종 합격 판정은 렌더 이후에 합니다.
8. Render/Packaging Agent는 최종 MP4 렌더, 오디오 mux/check, `outputs/` 정리, 최종 산출물 검증 요약을 담당합니다.
9. 모든 구현 Agent는 `voiceover.wav`, `transcript/sentences.json`, 승인된 장면 타임라인을 공통 기준으로 사용하고, 같은 파일이나 같은 도구 소스 폴더를 동시에 수정하지 않습니다.
10. 작업별 서브에이전트 지시서는 `agent-briefs/`에 역할별 Markdown 파일로 둡니다. 공통 역할 규칙은 루트 `AGENTS.md`와 `memory/workflows.md`를 기준으로 합니다.

## Git ignore policy

1. GitHub에는 작업 소스, 공통 문서, 도구 스크립트, 재현에 필요한 설정 파일을 올립니다.
2. 날짜형 작업 폴더(`YYYYMMDD_작업제목/`)는 개별 로컬 작업공간으로 보고 기본적으로 Git 추적 대상에서 제외합니다.
3. `outputs/`, `review-frames/`, `voiceover.*`, `script/`, `transcript/`, `node_modules/`, `.venv/`, 캐시와 로그도 Git 추적 대상에서 제외합니다.
4. 이미 추적 중인 작업 폴더나 산출물은 `.gitignore`만으로 빠지지 않으므로 필요하면 `git rm --cached`로 인덱스에서만 제거합니다.

## README audience

1. 루트 `README.md`는 GitHub 방문자가 처음 읽는 문서이므로 Codex Desktop에서 자연어로 요청하는 흐름을 먼저 설명합니다.
2. 터미널 명령어는 필수 절차처럼 앞세우지 않고, 설치 확인이나 문제 해결용 참고 섹션에 둡니다.
3. 사용자가 직접 실행할 명령보다 Codex에게 전달할 프롬프트 예시를 우선합니다.
