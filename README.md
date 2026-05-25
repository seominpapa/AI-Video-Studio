# AI Video Studio

Codex Desktop App에서 영상 제작을 하기 위한 작업실입니다.

## Remotion과 HyperFrames

이 저장소에서는 Remotion과 HyperFrames 두 가지 방식으로 영상을 만들 수 있습니다. 둘 다 최종 결과는 작업 폴더의 `outputs/`에 MP4로 렌더링하지만, 작업 방식과 강점이 다릅니다.

### 작업 방식의 차이

Remotion:

- React/TypeScript 코드로 영상을 만듭니다.
- 화면을 React 컴포넌트로 나누고, 프레임 번호와 props를 기준으로 움직임을 계산합니다.
- 반복 가능한 템플릿, 데이터 기반 인포그래픽, 차트, 복잡한 상태 변화, 재사용 가능한 컴포넌트가 필요한 작업에 적합합니다.
- 코드 구조가 앱 개발 방식에 가까워서 규모가 커지거나 같은 형식의 영상을 반복 생산할 때 유리합니다.

HyperFrames:

- HTML/CSS/GSAP 기반으로 영상을 만듭니다.
- HTML에 `data-*` 타이밍 속성을 두고, GSAP timeline으로 장면 등장, 전환, 강조 모션을 구성합니다.
- 웹 기반 모션그래픽, 타이포그래피 애니메이션, 장면 전환, 오디오 반응형 효과, 짧은 홍보 영상에 적합합니다.
- 정적인 최종 레이아웃을 먼저 잡고 그 위치로 요소가 들어오게 만드는 방식이라, 화면 디자인과 모션을 빠르게 조율하기 좋습니다.

### Remotion과 HyperFrames 스킬의 역할

두 스킬은 사용자가 첨부한 자료를 바탕으로 모션그래픽 제작 과정을 도와줍니다.

- 음성 파일과 원본 스크립트 파일을 첨부하면, Codex가 스크립트 정리본을 만들고 음성 길이와 대본을 확인한 뒤 장면 타임라인을 나눠 Remotion 또는 HyperFrames 코드로 모션그래픽을 구현할 수 있습니다.
- 스크립트만 있는 경우에는 먼저 내레이션용 정리본을 만들고, 필요하면 TTS 또는 별도 음성 생성 도구를 통해 음성 파일을 준비할 수 있습니다.
- 사용자 음성 샘플이 있으면 음성 생성 워크플로를 도와줄 수 있지만, 생성 음성은 직접 녹음한 음성보다 품질이 낮을 수 있으므로 최종 확인이 필요합니다.
- PDF, 문서, 강의안, 보고서 같은 첨부자료가 있으면 핵심 내용을 추출해 대본 초안, 장면 구성, 화면별 메시지, 인포그래픽 방향을 만들 수 있습니다.
- 첨부문서만으로도 영상 초안 제작은 가능하지만, 최종 영상의 싱크와 완성도를 높이려면 `.txt` 원본 스크립트 파일과 음성 파일을 함께 첨부하는 것이 좋습니다.
- 첨부자료의 브랜드, 톤, 색상, 스타일 단서가 루트 `DESIGN.md`와 겹치면 `DESIGN.md`를 공통 제작 원칙으로 두고 첨부자료의 브랜드 요소를 작업별 보정값으로 반영합니다. 명확히 충돌하면 사용자에게 우선순위를 확인합니다.

두 도구 모두 Codex Desktop 플러그인을 추가해서 사용합니다. 플러그인은 작업을 돕는 도구이고, 실제 소스와 결과물은 작업 폴더 안에 생성됩니다.


대부분의 작업은 터미널 명령어를 직접 입력하지 않고, Codex에게 자연어로 요청하면 됩니다. 이 저장소는 Codex가 일관되게 작업할 수 있도록 공통 규칙, 디자인 기준, 로컬 전사 도구를 모아둔 루트 폴더입니다.

## 프로젝트 파일 구조

루트에는 반복 영상 제작에 필요한 공통 문서와 도구만 둡니다. 실제 영상 소스, 검수 프레임, 렌더 파일은 날짜형 작업 폴더 안에서 관리합니다.

```text
AI Video Studio/
  README.md
  AGENTS.md
  DESIGN.md
  LICENSE
  .gitignore
  memory/
    README.md
    decisions.md
    mistakes.md
    workflows.md
  tools/
    transcription/
      README.md
      requirements.txt
      transcribe.py
      tests/
        test_transcribe.py
  YYYYMMDD_작업제목/
    audio/
    script/
    agent-briefs/
    assets/
    transcript/
    remotion-project/
    source-hyperframes/
    review-frames/
    outputs/
```

각 항목의 역할은 다음과 같습니다.

- `README.md`: 사람이 처음 읽는 온보딩 문서입니다.
- `AGENTS.md`: Codex가 영상 작업 중 반드시 따라야 하는 운영 규칙입니다.
- `DESIGN.md`: 모든 Remotion, HyperFrames 영상 작업에 적용하는 공통 디자인 기준입니다.
- `LICENSE`: 프로젝트의 MIT 라이선스입니다.
- `.gitignore`: 날짜형 작업 폴더, 렌더 결과, 음성 원본, 검수 프레임, 로컬 의존성을 Git 추적에서 제외합니다.
- `memory/`: 장기 운영 결정, 반복 실수 방지 메모, 안정화된 워크플로를 짧게 기록합니다.
- `tools/transcription/`: 첨부한 음성 파일에서 문장별 타임코드를 만들기 위한 로컬 전사 도구입니다.
- `YYYYMMDD_작업제목/`: 개별 영상 작업 공간입니다. 새 영상 작업마다 새로 만들며 기본적으로 GitHub에 올리지 않습니다.
- `audio/`: 사용자가 첨부한 음성 원본과 Codex가 작업 중 정리한 기준 음성 파일을 둡니다. 사용자가 파일명을 미리 맞출 필요는 없습니다.
- `script/`: 첨부한 스크립트 원본과 음성용으로 변환한 `narration-script.txt`를 둡니다.
- `agent-briefs/`: 작업별 서브에이전트 지시서를 둡니다. 예를 들어 `orchestrator.md`, `intake-sync.md`, `design.md`, `remotion.md`, `hyperframes.md`, `qa.md`, `render-packaging.md`처럼 역할별 입력, 출력, 쓰기 범위를 정리합니다.
- `assets/`: 작업별 이미지, 폰트, 참고 자료 같은 보조 자산을 둡니다.
- `transcript/`: 로컬 전사 결과와 타임라인 기준 파일을 둡니다.
- `remotion-project/`: Remotion으로 구현할 때 사용하는 프로젝트 소스 폴더입니다.
- `source-hyperframes/`: HyperFrames로 구현할 때 사용하는 소스 폴더입니다.
- `review-frames/`: 장면별 대표 프레임, 컨택트 시트, 검수용 이미지를 둡니다.
- `outputs/`: 최종 MP4와 렌더 결과물을 둡니다.

새 영상 프로젝트는 실행할 때마다 날짜형 작업 폴더로 생성됩니다.

```text
YYYYMMDD_작업제목/
  audio/
  script/
  agent-briefs/
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


## 빠른 시작

1. 이 저장소를 클론합니다.

   ```powershell
   git clone https://github.com/seominpapa/AI-Video-Studio.git
   ```

2. Codex Desktop App에서 이 폴더를 엽니다.
3. Codex Desktop에 Remotion 플러그인과 HyperFrames by HeyGen 플러그인을 추가합니다.
4. 새 영상 작업을 자연어로 요청합니다.

새 영상 제작을 요청하면 Codex는 디자인 기준 확인 단계에서 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)의 `DESIGN.md` 종류를 리스트업하고 선택할 수 있게 안내합니다. 원하는 스타일이 있으면 선택하고, 선택하지 않으면 루트 `DESIGN.md` 기준으로 그대로 진행합니다.

예시 1: 음성 파일과 원본 스크립트로 바로 영상 만들기

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
새 영상 작업 폴더를 만들고 Remotion으로 16:9 모션그래픽 영상을 만들어줘.
첨부한 음성 파일과 원본 스크립트 파일을 사용해줘.
스크립트 파일은 Codex가 음성용 정리 규칙에 맞게 변환해서 작업 폴더로 옮겨줘.

장면별 타임라인을 만들고, 대표 프레임 검수 후 outputs 폴더에 렌더해줘.
```

예시 2: PDF, 문서, 기획안, URL로 영상 초안 만들기

```text
AGENTS.md와 DESIGN.md 기준으로 진행해줘.
첨부한 PDF와 참고 URL을 분석해서 9:16 세로 모션그래픽 영상 초안을 만들어줘.
이번 작업은 HyperFrames로 진행해줘.

먼저 핵심 메시지, 대본 초안, 장면 구성을 만들고,
음성 파일과 원본 스크립트가 없으면 최종 싱크 작업 전에 필요한 파일을 요청해줘.
초안 영상은 outputs 폴더에 렌더해줘.
```

첨부한 PDF, 문서, 기획안, URL에 브랜드 색상이나 스타일 단서가 있으면 Codex는 루트 `DESIGN.md`와 함께 비교합니다. 사용자가 별도로 지시한 내용이 가장 우선이고, 첨부자료의 브랜드 요소는 이번 작업의 보정값으로 반영합니다. 명확히 충돌하는 경우에는 먼저 우선순위를 확인하거나 작업별 디자인 브리프에 선택 기준을 남깁니다.


## Codex에게 맡기는 일

보통 사용자는 아래 내용을 Codex에게 말해주면 됩니다.

- 만들 영상의 주제
- 사용할 도구: Remotion 또는 HyperFrames
- 화면비: 예를 들어 16:9, 9:16
- 첨부한 음성 파일
- 첨부한 원본 스크립트 파일
- 원하는 분위기나 참고 스타일
- 최종 파일명

Codex는 이 정보를 바탕으로 다음 일을 처리합니다.

1. 날짜형 작업 폴더 생성
2. 루트 `DESIGN.md` 확인
3. `awesome-design-md`의 `DESIGN.md` 선택지 안내, 또는 루트 `DESIGN.md` 기본값 확정
4. 첨부한 음성 파일과 원본 스크립트 파일 확인
5. 원본 스크립트 파일에 정리 규칙을 적용해 `script/narration-script.txt`로 변환
6. 음성 파일 길이 확인
7. 필요하면 로컬 전사 실행
8. 장면별 타임라인 작성
9. Remotion 또는 HyperFrames 코드 작성
10. 대표 프레임 렌더링 및 레이아웃 검수
11. 최종 MP4 렌더링

## 서브에이전트 병렬 작업

큰 영상 작업은 Orchestrator가 중심이 되어 여러 서브에이전트로 나눌 수 있습니다. 다만 음성 파일 확보, 전사 타임코드 생성, 장면 타임라인 확정은 먼저 정리되어야 합니다. 그 뒤 디자인, 구현, 검수 준비를 병렬로 진행하는 방식이 가장 안전합니다.

기본 구성:

```text
Orchestrator
  Intake/Sync Agent
  Design Agent
  Remotion Agent        optional
  HyperFrames Agent     optional
  QA Agent
  Render/Packaging Agent
```

- Orchestrator: 사용자 요구 해석, 도구 선택, 작업 폴더 생성, 타임라인 승인, 디자인 승인, QA 수정 지시, 최종 렌더 승인
- Intake/Sync Agent: 음성 길이 확인, 로컬 전사, `transcript/sentences.json`, 장면 타임라인 표 작성
- Design Agent: `DESIGN.md` 기준 비주얼 시스템, 안전 영역, 인포그래픽 구조, 텍스트 밀도, 장면별 디자인 브리프 작성
- Remotion Agent: Remotion 요청 또는 선택 시 `remotion-project/` 구현
- HyperFrames Agent: HyperFrames 요청 또는 선택 시 `source-hyperframes/` 구현
- QA Agent: 샘플 프레임 계획, 텍스트 겹침, 싱크, 디버그 UI 제거, 오디오 트랙 포함 여부 검수
- Render/Packaging Agent: 최종 MP4 렌더, 오디오 mux/check, `outputs/` 정리

작업별 지시가 길어지면 `agent-briefs/`에 역할별 brief를 만들어 둡니다. 이 폴더는 실제 에이전트 실행을 위한 작업별 지시서 공간이며, 공통 역할 규칙은 루트 `AGENTS.md`와 `memory/workflows.md`를 기준으로 합니다.

도구별 실행 모드는 이렇게 나뉩니다.

```text
Remotion 요청
→ Orchestrator → Intake/Sync → Design → Remotion Agent → QA → Render/Packaging

HyperFrames 요청
→ Orchestrator → Intake/Sync → Design → HyperFrames Agent → QA → Render/Packaging

두 도구 비교 요청
→ Orchestrator → Intake/Sync → Design
→ Remotion Agent + HyperFrames Agent 병렬
→ QA 비교 → Render/Packaging
```

## 음성 파일이 중요한 이유

스크립트 기반 모션그래픽은 음성과 화면 싱크가 중요합니다.

그래서 이 작업실에서는 사용자가 음성 파일이나 원본 스크립트 파일을 제공하지 않은 경우, Codex가 최종 영상을 바로 만들지 않고 먼저 필요한 파일을 요청합니다. 초기 영상 생성 프롬프트에는 음성 파일과 원본 스크립트 파일을 둘 다 첨부하는 것을 기본으로 합니다.

사용자가 음성 파일명을 미리 `voiceover.wav`로 바꾸거나 프로젝트 폴더에 직접 넣어둘 필요는 없습니다. 영상 제작을 요청할 때 프롬프트 입력창에 음성 파일을 첨부하면, Codex가 새 작업 폴더 안에 필요한 기준 음성 파일로 복사하거나 변환해 사용합니다.

## 원본 스크립트 파일 첨부 방법

영상 제작 요청을 시작할 때는 최종 내레이션 내용이 담긴 원본 스크립트 파일을 `.txt`로 첨부하는 것을 권장합니다. 사용자가 아래 변환 규칙을 직접 적용해서 파일을 만들 필요는 없습니다. Codex가 새 작업 폴더를 만든 뒤 첨부 스크립트를 `script/` 안으로 옮기고, 음성 녹음과 싱크 기준으로 쓰기 좋은 정리본을 `script/narration-script.txt`로 만듭니다.

PDF, 문서, 기획안, 강의안 같은 첨부문서만 있는 경우에도 모션그래픽 초안은 만들 수 있습니다. 다만 첨부문서는 보통 화면 구성과 대본 초안을 뽑기 위한 원천 자료입니다. 최종 싱크 작업에는 실제 음성 파일과 같은 내용의 원본 내레이션 스크립트 파일이 함께 있는 편이 훨씬 안정적입니다.

아래 규칙은 사용자가 미리 처리해야 하는 체크리스트가 아니라, Codex가 `script/narration-script.txt`를 만들 때 적용하는 변환 규칙입니다.

- 마크다운 기호, 코드펜스, 촬영 메모를 제거합니다.
- 모든 줄 뒤에 빈 줄 하나를 넣습니다.
- 영어 표현은 한국어 발음으로 바꿉니다. 예: `CLAUDE.md`는 `클로드 닷 엠디`, `ChatGPT`는 `챗지피티`.
- 숫자는 한국어로 바꿉니다. 예: `1,000`은 `천`, `1단계`는 `일 단계`.
- 대시 `-`, `—`는 삭제하고, 화살표 `→`는 쉼표로 바꿉니다.
- 코드 블록 내용과 `[화면 예시]` 같은 화면 전용 요소는 제거하고 주변 서술 문장만 유지합니다.
- 한 줄이 한 호흡이 되도록 약 20자를 넘는 줄은 의미 단위나 쉼표 위치에서 나누고, 핵심 키워드와 라벨은 단독 줄로 둡니다.

## 음성 파일 준비 방법

영상 제작을 시작할 때는 최종 내레이션 기준이 될 음성 파일과 같은 내용의 원본 스크립트 파일을 프롬프트 입력창에 함께 첨부하는 것이 가장 좋습니다. 첨부 파일명은 중요하지 않습니다. 이 저장소에서는 아래 두 가지 방식을 모두 허용하지만, 품질과 싱크를 우선한다면 사용자가 직접 준비한 음성 파일을 기준으로 작업하는 방식을 권장합니다.

### 방법 1: 직접 녹음하거나 생성한 음성 파일 제공

가장 단순한 방식입니다. 사용자가 휴대폰, 녹음 프로그램, 다른 TTS 도구 등으로 만든 음성 파일을 영상 제작 요청 메시지에 첨부하면 됩니다.

권장 형식은 WAV입니다. MP3, M4A, FLAC, WebM 같은 일반 오디오 파일도 첨부할 수 있습니다. 필요하면 Codex가 작업 폴더 안에 기준 음성 파일로 복사하거나 FFmpeg로 변환한 뒤 전사와 싱크 작업을 진행합니다.

Codex에게는 이렇게 요청하면 됩니다.

```text
첨부한 음성 파일을 기준 음성으로 사용해줘.
대본과 음성 기준으로 전사 타임코드를 만들고 장면 싱크를 맞춰줘.
```

### 방법 2: Voicebox로 내 목소리 샘플을 녹음하고 TTS 생성

[Voicebox](https://voicebox.sh/)는 로컬에서 실행되는 오픈소스 음성 스튜디오입니다. 내 목소리 샘플을 녹음하거나 업로드한 뒤, 스크립트를 입력해 TTS 음성을 만들 수 있습니다. 이 방식은 선택사항이며, Voicebox 앱 또는 로컬 서버가 실행 중이어야 합니다.

Voicebox 샘플 업로드는 WAV, MP3, FLAC, WebM 형식을 안내하고 있습니다. 이 저장소에서 사용할 최종 내레이션은 가능하면 WAV로 저장하되, 저장 파일명은 자유롭게 두어도 됩니다. 사용자 음성 샘플을 기반으로 음성 파일을 자동 생성할 수는 있지만, 직접 녹음한 원본 음성보다 발음, 감정, 호흡, 억양 품질이 떨어질 수 있습니다. 중요한 영상은 생성 음성을 한 번 들어보고 필요하면 재생성하거나 직접 녹음본으로 교체합니다.

기본 흐름:

1. [Voicebox](https://voicebox.sh/)에서 Windows용 앱을 다운로드해 설치합니다.
2. Voicebox를 실행합니다.
3. 새 voice profile을 만들고, 마이크로 짧고 깨끗한 샘플 음성을 녹음하거나 기존 샘플 파일을 업로드합니다.
4. 샘플 음성에서 실제로 말한 문장(reference text)을 확인합니다. 샘플과 문장이 잘 맞을수록 복제 품질이 좋아집니다.
5. 최종 내레이션 스크립트를 Voicebox의 생성 입력창에 넣고 TTS를 생성합니다.
6. 생성된 음성을 WAV 또는 사용 가능한 오디오 파일로 저장합니다.
7. 생성된 음성 파일을 영상 제작 요청 메시지에 첨부합니다.

Voicebox로 만든 음성을 사용할 때도 사용자가 파일명을 맞출 필요는 없습니다. Codex는 첨부한 음성 파일을 기준으로 길이 확인, 로컬 전사, 장면 타임라인, 싱크 검증을 진행합니다.

음성 샘플은 본인 목소리나 사용 권한이 있는 목소리만 사용합니다. 음성 원본과 생성된 음성 파일은 개인 자산이므로 기본적으로 GitHub에 올리지 않습니다.

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

## GitHub에 올리지 않는 것

개별 영상 작업 폴더는 기본적으로 GitHub에 올리지 않습니다.

`.gitignore`는 날짜형 작업 폴더와 로컬 의존성, 렌더 결과, 검수 프레임, 음성 원본, 전사 결과를 제외합니다.

대표적으로 제외되는 항목:

- `YYYYMMDD_작업제목/`
- `node_modules/`
- `tools/transcription/.venv/`
- `outputs/`
- `review-frames/`
- 작업 중 복사하거나 변환한 음성 파일
- `script/`
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
