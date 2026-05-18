# AI Video Studio

Codex Desktop App에서 영상 제작을 하기 위한 작업실입니다.

대부분의 작업은 터미널 명령어를 직접 입력하지 않고, Codex에게 자연어로 요청하면 됩니다. 이 저장소는 Codex가 일관되게 작업할 수 있도록 공통 규칙, 디자인 기준, 로컬 전사 도구를 모아둔 루트 폴더입니다.

## 빠른 시작

1. 이 저장소를 클론합니다.
2. Codex Desktop App에서 이 폴더를 엽니다.
3. Codex Desktop에 Remotion 플러그인과 HyperFrames by HeyGen 플러그인을 추가합니다.
4. 새 영상 작업을 자연어로 요청합니다.

예시:

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
새 영상 작업 폴더를 만들고 Remotion으로 16:9 모션그래픽 영상을 만들어줘.
음성 파일은 내가 제공할 voiceover.wav를 사용해줘.
대본은 아래 내용이야:

...

장면별 타임라인을 만들고, 대표 프레임 검수 후 outputs/final.mp4로 렌더해줘.
```

또는 HyperFrames를 쓰고 싶다면 이렇게 말하면 됩니다.

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
이번 작업은 HyperFrames로 만들어줘.
voiceover.wav와 대본을 기준으로 장면 타이밍을 맞추고,
검증 후 outputs/hyperframes-render.mp4로 렌더해줘.
```

## 이 저장소의 역할

이 저장소는 개별 영상 결과물을 모아두는 저장소라기보다, Codex Desktop에서 반복적으로 영상 작업을 하기 위한 공통 작업실입니다.

- `README.md`: 사람이 처음 볼 안내 문서
- `AGENTS.md`: Codex가 따라야 하는 작업 규칙
- `DESIGN.md`: 모든 영상 작업의 공통 디자인 기준
- `tools/transcription/`: 음성 파일을 로컬에서 전사하는 도구
- `memory/`: 장기 운영 결정과 반복 워크플로 메모

새 영상 프로젝트는 실행할 때마다 날짜형 작업 폴더로 생성됩니다.

```text
YYYYMMDD_작업제목/
  voiceover.wav
  remotion-project/
  source-hyperframes/
  assets/
  transcript/
  review-frames/
  outputs/
```

예시:

```text
20260518_신규영상작업/
```

날짜형 작업 폴더는 로컬 작업공간입니다. GitHub에는 기본적으로 올리지 않습니다.

## Codex에게 맡기는 일

보통 사용자는 아래 내용을 Codex에게 말해주면 됩니다.

- 만들 영상의 주제
- 사용할 도구: Remotion 또는 HyperFrames
- 화면비: 예를 들어 16:9, 9:16
- 대본 또는 원고
- 음성 파일 위치
- 원하는 분위기나 참고 스타일
- 최종 파일명

Codex는 이 정보를 바탕으로 다음 일을 처리합니다.

1. 날짜형 작업 폴더 생성
2. 루트 `DESIGN.md` 확인
3. 음성 파일 길이 확인
4. 필요하면 로컬 전사 실행
5. 장면별 타임라인 작성
6. Remotion 또는 HyperFrames 코드 작성
7. 대표 프레임 렌더링 및 레이아웃 검수
8. 최종 MP4 렌더링

## 음성 파일이 중요한 이유

스크립트 기반 모션그래픽은 음성과 화면 싱크가 중요합니다.

그래서 이 작업실에서는 사용자가 음성 파일을 제공하지 않은 경우, Codex가 최종 영상을 바로 만들지 않고 먼저 음성 파일을 요청합니다.

기본 음성 파일명은 다음과 같습니다.

```text
YYYYMMDD_작업제목/voiceover.wav
```

정확한 싱크가 필요하면 Codex는 `tools/transcription/transcribe.py`를 사용해 로컬 전사를 시도합니다. 전사 결과는 보통 작업 폴더의 `transcript/sentences.json`에 생성되고, 이 파일이 장면 타이밍의 기준이 됩니다.

## 로컬 전사 모델

전사는 기본적으로 외부 STT 서비스에 음성을 업로드하지 않고 로컬에서 처리합니다. 이 저장소의 전사 도구는 `faster-whisper`를 사용합니다.

처음 사용하는 환경에서는 Codex에게 이렇게 말하면 됩니다.

```text
로컬 전사 환경이 설치되어 있는지 확인하고,
필요하면 tools/transcription/.venv를 만들고 requirements.txt를 설치해줘.
```

처음 설치하거나 모델을 처음 사용할 때는 패키지와 모델 파일 다운로드가 발생할 수 있습니다.

외부 전사 서비스가 필요한 경우에는 음성 파일이 외부로 전송될 수 있으므로, Codex가 먼저 사용자 승인을 받아야 합니다.

## Remotion과 HyperFrames

이 저장소에서는 두 가지 방식으로 영상을 만들 수 있습니다.

Remotion:

- React/TypeScript 코드로 영상을 만듭니다.
- 복잡한 컴포넌트, 데이터 기반 인포그래픽, 정교한 타임라인에 적합합니다.
- 결과물은 작업 폴더의 `outputs/`에 MP4로 렌더링합니다.

HyperFrames:

- HTML/CSS/GSAP 기반으로 영상을 만듭니다.
- 웹 기반 모션그래픽, 타이포그래피 애니메이션, 장면 전환 작업에 적합합니다.
- 결과물은 작업 폴더의 `outputs/`에 MP4로 렌더링합니다.

두 도구 모두 Codex Desktop 플러그인을 추가해서 사용합니다. 플러그인은 작업을 돕는 도구이고, 실제 소스와 결과물은 작업 폴더 안에 생성됩니다.

## 사용 예시

### Remotion 영상 요청

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
새 작업명은 직장인AI_요약영상이야.
Remotion으로 16:9 모션그래픽 영상을 만들어줘.
voiceover.wav는 작업 폴더에 넣어둘게.

대본:
...

전사 타임코드 기준으로 장면을 나누고,
텍스트와 인포그래픽이 겹치지 않게 검수한 뒤
outputs/final.mp4로 렌더해줘.
```

### HyperFrames 영상 요청

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
새 작업명은 제품소개_쇼츠야.
HyperFrames로 9:16 세로 영상을 만들어줘.
음성 파일과 대본 기준으로 장면 싱크를 맞춰줘.

최종 결과는 outputs/final.mp4로 만들어줘.
```

### 기존 작업 이어서 수정

```text
20260518_직장인AI_요약영상 작업 폴더를 확인해줘.
최종 영상에서 3번째 장면의 텍스트가 너무 많으니 더 짧게 줄이고,
review-frames를 다시 뽑아서 겹침 여부를 확인해줘.
```

## 직접 명령어가 필요한 경우

대부분은 Codex에게 맡기면 됩니다. 아래 명령어는 Codex가 문제를 진단하거나, 사용자가 직접 확인하고 싶을 때만 참고하면 됩니다.

저장소 클론:

```powershell
git clone <repository-url>
Set-Location ".\AI Video Studio"
```

로컬 전사 환경 설치:

```powershell
python -m venv .\tools\transcription\.venv
.\tools\transcription\.venv\Scripts\python.exe -m pip install -r .\tools\transcription\requirements.txt
```

전사 도구 확인:

```powershell
.\tools\transcription\.venv\Scripts\python.exe .\tools\transcription\transcribe.py --check
```

Remotion 렌더 예시:

```powershell
npx.cmd remotion render <composition-id> ..\..\outputs\final.mp4 --codec=h264 --audio-codec=aac
```

HyperFrames 검증 및 렌더 예시:

```powershell
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes inspect --samples 15
npx.cmd hyperframes render --output ..\outputs\final.mp4 --quality high --fps 30
```

FFmpeg가 필요한 경우:

```powershell
npm.cmd install --no-save @ffmpeg-installer/ffmpeg
```

## GitHub에 올리지 않는 것

개별 영상 작업 폴더는 기본적으로 GitHub에 올리지 않습니다.

`.gitignore`는 날짜형 작업 폴더와 로컬 의존성, 렌더 결과, 검수 프레임, 음성 원본, 전사 결과를 제외합니다.

대표적으로 제외되는 항목:

- `YYYYMMDD_작업제목/`
- `node_modules/`
- `tools/transcription/.venv/`
- `outputs/`
- `review-frames/`
- `voiceover.*`
- `transcript/`
- `.env`
- 로그와 캐시 파일

이미 Git이 추적 중인 작업 폴더는 `.gitignore`만으로 빠지지 않습니다. 그런 경우 Codex에게 이렇게 요청하면 됩니다.

```text
날짜형 작업 폴더는 로컬에만 남기고 Git 추적에서 제거해줘.
```

## 기억할 것

- 새 영상은 항상 새 날짜형 작업 폴더에서 진행합니다.
- 최종 영상 싱크는 음성 파일과 전사 타임코드를 기준으로 맞춥니다.
- 텍스트와 인포그래픽은 겹치면 안 됩니다.
- 검수용 프레임은 `review-frames/`에 만들지만 GitHub에는 올리지 않습니다.
- 최종 MP4는 `outputs/`에 만들지만 GitHub에는 올리지 않습니다.
