# Agent Instructions

이 폴더는 영상 제작 작업의 루트입니다. 루트에 소스와 산출물을 바로 흩뿌리지 말고, 매 작업마다 날짜와 제목을 포함한 작업 폴더를 만든 뒤 그 안에서 진행합니다.

모든 영상 작업은 루트의 `DESIGN.md`를 먼저 참고합니다. 작업별 디자인 브리프가 추가로 필요하면 해당 작업 폴더 안에 별도 문서를 만들되, 공통 원칙은 루트 `DESIGN.md`를 우선합니다.

컨텍스트가 부족하거나 이전 결정이 필요하면 루트의 `memory/README.md`를 참고합니다. `memory/`에는 장기 운영 결정과 반복 작업 규칙만 기록하고, 산출물이나 원본 자산은 넣지 않습니다.

## Memory Protocol

작업을 시작할 때 현재 요청이 기존 운영 결정, 폴더 구조, 디자인 규칙, 반복 워크플로와 관련되어 있으면 루트의 `memory/README.md`를 먼저 확인합니다.

다음에 해당하는 내용이 생기면 작업 종료 전에 `memory/`를 업데이트합니다.

- 새 작업 규칙이 정해진 경우
- 폴더 구조나 산출물 관리 방식이 바뀐 경우
- 반복 실수를 막기 위한 교훈이 생긴 경우
- 특정 도구 사용법, 검증 절차, 렌더 절차가 안정화된 경우
- 사용자가 앞으로도 유지하길 원하는 선호를 말한 경우

다음 내용은 `memory/`에 기록하지 않습니다.

- 임시 파일명
- 한 번만 쓰는 산출물
- 비밀키, 계정 정보, 인증 정보
- 확실하지 않은 추측
- 너무 긴 대화 요약

메모리는 짧게 유지합니다. 오래된 내용과 충돌하면 최신 결정을 우선하고, 충돌 내용을 정리합니다.

최종 답변 전에 `memory/` 업데이트가 필요한 결정이 있었는지 점검합니다. 필요하면 `memory/README.md`, `memory/decisions.md`, `memory/mistakes.md`, `memory/workflows.md` 중 가장 알맞은 파일을 업데이트합니다.

## 스크립트 기반 영상 제작 규칙

스크립트, 대본, 원고를 바탕으로 모션그래픽 영상을 제작해달라는 요청이 오면 Remotion과 HyperFrames 모두 아래 규칙을 따릅니다.

- 사용자가 음성 파일을 제공하지 않았다면 제작을 시작하기 전에 반드시 음성 파일을 요청합니다. 스크립트만으로 임의 타이밍을 잡아 최종 영상을 만들지 않습니다.
- 음성 파일이 있으면 먼저 전체 길이를 확인하고, 스크립트를 장면 단위로 나눈 타임라인 표를 만듭니다. 각 장면은 시작 시간, 종료 시간, 핵심 메시지, 인포그래픽 구조, 표시할 텍스트를 가져야 합니다.
- 정확한 문장/장면 싱크가 필요하거나 사용자가 싱크 불일치를 지적한 경우, 무음 구간 분석이나 사람이 나눈 장면표만으로 싱크가 맞는 것으로 확정하지 않습니다. 전사 타임코드 또는 강제 정렬 결과를 만들거나 사용자에게 요청해 실제 발화 기준 타임라인을 먼저 확보합니다.
- 신규 영상 작업에서 전사 타임코드가 필요하면 먼저 루트의 `tools/transcription/transcribe.py`를 사용해 로컬 전사를 시도합니다. 결과는 작업 폴더의 `transcript/sentences.json`을 기준 파일로 삼고, Remotion/HyperFrames 타임라인은 이 파일에서 시작 시간과 종료 시간을 읽어 맞춥니다.
- 로컬 전사 모델이나 패키지가 없으면 루트의 `tools/transcription/.venv` 가상환경을 만들고 `tools/transcription/requirements.txt`를 설치하도록 안내하거나 실행합니다. 이 방식은 패키지와 모델을 내려받지만 음성 파일을 외부 STT 서비스로 업로드하지 않는 로컬 처리 방식을 우선합니다.
- 외부 전사 도구를 사용해야 하는 경우에는 음성 파일이 외부 패키지나 서비스로 전송될 수 있음을 사용자에게 먼저 알리고 명시 승인을 받은 뒤 실행합니다. 승인이 없으면 사용자가 제공한 SRT, VTT, 전사본만 사용합니다.
- `tools/transcription/transcribe.py --allow-estimated`로 만든 추정 타임라인은 레이아웃 초안용으로만 사용합니다. 사용자가 명시적으로 승인하지 않는 한 최종 영상 싱크 기준으로 사용하지 않습니다.
- 싱크 불일치가 반복되고 Remotion, HyperFrames, 이전 대본 배열처럼 서로 다른 타임라인이 섞여 있으면 기존 구현을 부분 수정하지 않습니다. 작업 폴더 루트의 원본 음성 `voiceover.wav`만 보존하고 기존 도구별 소스, 렌더, 검수 프레임을 정리한 뒤 전사 타임코드 기준으로 처음부터 다시 설계합니다.
- 원본 음성, 스크립트, HyperFrames 같은 기존 소스에 장면 타임라인이 이미 있으면 그 장면 수, 순서, 시작 시간을 기준으로 Remotion/HyperFrames 구현 타임라인을 맞춥니다. 사용자가 명시적으로 재구성을 요청하지 않는 한 12개 장면을 10개 장면처럼 임의로 합치거나 줄이지 않습니다.
- 구현 후에는 소스 타임라인 또는 전사 타임코드, 화면 장면 배열, 텍스트 오버레이 배열의 시작 시간이 서로 같은지 비교합니다. 핵심 텍스트와 인포그래픽은 해당 발화 시작 시점과 같거나 0.1~0.2초 먼저 식별 가능해야 하며, 같은 시점에 화면 요소끼리만 바뀌는 것은 싱크 검증으로 보지 않습니다.
- 전사 문장 사이에 무음 공백이 있더라도 화면 장면에는 빈 구간이 생기면 안 됩니다. 다음 장면 시작 전까지는 이전 장면을 유지하도록 장면 `end`를 확장하거나, 장면 선택 fallback이 마지막 장면이 아니라 직전 장면을 반환하도록 구현합니다.
- 모션그래픽은 인포그래픽과 텍스트가 함께 의미를 만들도록 구성합니다. 텍스트는 제목, 1줄 설명, 짧은 라벨 중심으로 쓰고, 전체 음성을 자막처럼 계속 노출하지 않습니다.
- 인포그래픽과 텍스트는 절대 겹쳐 보이면 안 됩니다. 대표 프레임을 `review-frames/`에 렌더링해 모든 장면의 텍스트 겹침, 여백, 가독성을 반드시 리뷰합니다.
- 타임스탬프가 모션그래픽과 정확히 일치하는지 검증합니다. 최소한 각 장면의 시작, 중간, 종료 근처 프레임을 확인하고, 오디오 내용과 화면 메시지가 어긋나면 타이밍을 수정합니다.
- 타임스탬프 싱크 문제가 발견되었거나 사용자가 싱크 불일치를 지적하면, 전체 타임라인을 1초 단위와 장면 전환 전후 프레임으로 샘플링해 `review-frames/`에 렌더링하고 컨택트 시트로 검수합니다. 가능하면 검수용 렌더에는 현재 시간, 프레임, 장면 ID를 표시합니다.
- 현재 시간, 프레임 번호, 진행률 바 같은 검수용 디버그 UI는 최종 렌더에 포함하지 않습니다. 필요한 경우 별도 debug composition, debug prop, 또는 `review-frames/`용 렌더에서만 표시하고 최종 MP4 렌더 전에 비활성화 여부를 검증합니다.
- 장면 전환 페이드 때문에 장면 시작 시점에 화면이 비거나 메시지가 늦게 보이면 싱크 오류로 간주합니다. 전환은 짧게 유지하고, 장면 시작 프레임부터 핵심 텍스트와 인포그래픽이 식별 가능해야 합니다.
- 장면별 인포그래픽 구조가 반복되지 않는지 확인합니다. 같은 카드 배열, 같은 차트, 같은 라벨 위치가 계속 반복되면 다시 설계합니다.
- 최종 렌더 전 도구별 lint, validate, inspect 또는 still render 같은 검증을 실행합니다. 검증이 불가능했던 경우에는 이유를 작업 결과에 명시합니다.
- 음성 원본 파일은 HyperFrames와 Remotion에서 공통으로 쓰는 소스이므로 작업 폴더 루트에 둡니다. 예: `YYYYMMDD_작업제목/voiceover.wav`
- 도구 구조상 Remotion `public/` 같은 별도 위치에 복사본이나 링크가 꼭 필요하면 루트 음성 파일을 원본 기준으로 삼고, 도구별 파일은 렌더용 사본으로만 취급합니다.

## 새 작업 폴더 규칙

루트 폴더에서 영상 제작, 모션그래픽, Remotion, HyperFrames 작업을 요청받으면 먼저 현재 날짜와 작업 제목으로 아래 형식의 폴더를 만듭니다.

```text
YYYYMMDD_작업제목
```

예시:

```text
20260517_직장인AI_PPT_텍스트인포그래픽
```

작업 제목은 짧고 알아보기 쉽게 만들고, 공백은 `_`로 바꿉니다. Windows 경로에서 문제가 될 수 있는 문자(`\ / : * ? " < > |`)는 쓰지 않습니다.

그 다음 모든 소스, 중간 산출물, 검토 프레임, 최종 렌더 파일은 해당 작업 폴더 안에서만 관리합니다.

권장 구조:

```text
YYYYMMDD_작업제목/
  voiceover.wav
  remotion-project/
  source-hyperframes/
  assets/
  review-frames/
  outputs/
```

## Remotion 작업

Remotion 플러그인은 설치되어 있다고 가정합니다. 다만 실제 렌더링은 작업 폴더 안의 Node 의존성에 좌우되므로, 새 Remotion 프로젝트를 만들면 반드시 `npm.cmd install`부터 실행합니다.

빈 작업 폴더에서 Remotion 프로젝트를 새로 만들 때:

```powershell
Set-Location .\remotion-project
npx.cmd create-video@latest --yes --blank --no-tailwind remotion-video
Set-Location .\remotion-video
npm.cmd install
```

이미 `package.json`이 있는 Remotion 프로젝트라면:

```powershell
npm.cmd install
```

미리보기:

```powershell
npx.cmd remotion studio
```

또는 `package.json`에 `dev` 스크립트가 있으면:

```powershell
npm.cmd run dev
```

검증:

```powershell
npm.cmd run lint
```

한 프레임만 빠르게 확인할 때:

```powershell
npx.cmd remotion still <composition-id> --scale=0.25 --frame=30 ..\..\review-frames\frame-030.png
```

렌더:

```powershell
npx.cmd remotion render
```

출력 파일명을 지정할 때:

```powershell
npx.cmd remotion render <composition-id> ..\..\outputs\final.mp4 --codec=h264 --audio-codec=aac
```

## HyperFrames 작업

HyperFrames 플러그인은 설치되어 있다고 가정합니다. 다만 CLI 실행, 렌더링, FFmpeg 후처리는 로컬 의존성이나 캐시 상태에 영향을 받을 수 있습니다. 명령이 실패하면 루트에 설치하지 말고 해당 작업 폴더 또는 `source-hyperframes/` 안에서 필요한 의존성을 설치합니다.

HyperFrames 소스는 작업 폴더 안의 `source-hyperframes/`에 둡니다.

검증:

```powershell
Set-Location .\source-hyperframes
npx.cmd hyperframes lint
npx.cmd hyperframes validate
npx.cmd hyperframes inspect --samples 15
```

렌더:

```powershell
npx.cmd hyperframes render --output ..\outputs\hyperframes-render.mp4 --quality high --fps 30
```

HyperFrames 렌더에서 오디오가 누락되면 FFmpeg로 원본 음성과 다시 mux합니다.

## FFmpeg 사용

영상/음성 합치기, 오디오 확인, 썸네일 추출, 컨테이너 검사에는 FFmpeg를 사용합니다. 시스템에 FFmpeg가 없다면 작업 폴더 안에서 로컬 바이너리를 설치합니다. 사용자 홈이나 다른 프로젝트에 설치된 FFmpeg 경로를 문서에 고정하지 않습니다.

```powershell
npm.cmd install --no-save @ffmpeg-installer/ffmpeg
```

PowerShell에서 임시로 PATH에 올릴 때:

```powershell
$env:PATH=".\node_modules\@ffmpeg-installer\win32-x64;$env:PATH"
```

직접 실행할 때:

```powershell
& ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe" -version
```

## Common Motion Layout Rules

Remotion, HyperFrames 등 도구와 관계없이 스크립트 기반 모션그래픽 영상을 만들 때는 아래 배치 규칙을 공통으로 적용합니다.

- 텍스트와 인포그래픽을 같은 시각 영역에 겹쳐 얹지 않습니다. 기본 구조는 상단의 짧은 설명 카드, 중앙의 인포그래픽, 하단의 라벨 트레이처럼 역할별 안전 영역을 분리합니다.
- 장면별 라벨을 SVG 아이콘, 연결선, 카드, 차트 위에 절대좌표로 직접 배치하지 않습니다. 꼭 필요한 경우가 아니면 라벨은 하단 또는 측면의 고정 트레이에 모아 배치합니다.
- 인포그래픽 본체가 텍스트 영역을 침범하면 본체를 축소하거나 이동해 여백을 먼저 확보합니다. 텍스트를 반투명 박스로 덮어 해결한 것으로 간주하지 않습니다.
- 이전 장면의 잔상, 페이드아웃 중인 요소, 장식용 점/선도 라벨 트레이와 겹치면 안 됩니다. 사라지는 요소는 완전히 페이드아웃하거나 텍스트 안전 영역 밖으로 이동합니다.
- 레이아웃을 수정한 뒤에는 문제 장면의 시작, 중간, 종료 근처 프레임을 다시 렌더링해 실제 PNG 기준으로 겹침 여부를 확인합니다.
