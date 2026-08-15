# White Animation Integration

이 작업실의 White Animation 옵션은 [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation)을 작업별로 사용하는 연동 방식입니다. 원본 레포는 MIT 라이선스이며, 소스·가상환경·캐시는 공용 루트가 아니라 각 날짜형 작업 폴더에만 둡니다.

White Animation 요청에는 별도 외부 `DESIGN.md`를 선택하거나 사용자에게 디자인 기준을 묻지 않습니다. 원본 레포의 미색 종이, 스케치 선, 제한된 포인트 색, 이미지 내 텍스트 금지 규칙을 시각 기준으로 적용하고, 루트 `DESIGN.md`는 여백·가독성·싱크·검수 안전 규칙에만 사용합니다.

## 선택 조건

- 사용자가 원본 스크립트 파일과 `.wav` 음성 파일을 모두 첨부한 경우에만 제시합니다.
- `tools/transcription/transcribe.py`의 실제 로컬 전사로 `transcript/subtitles.srt`를 만든 뒤 사용합니다. `--allow-estimated`로 만든 SRT는 초안에도 표시할 수는 있지만 최종 렌더 기준으로 쓰지 않습니다.
- 설명형 강의, 이야기, 개념을 순서대로 손그림으로 보여 주는 영상에 적합합니다. 데이터 차트·반복 템플릿은 Remotion, 웹 레이아웃 기반 타이포그래피 영상은 HyperFrames가 더 적합할 수 있습니다.

## 작업 폴더 구조

```text
YYYYMMDD_작업제목/
  audio/
  script/
  transcript/
    subtitles.srt
  timeline/
    scenes.json
  assets/
    whiteboard/
      scene-01-이름.png
      scene-01-이름.annotation.json
  source-whiteboard/
    srt-whiteboard-animation/
  review-frames/
  outputs/
    whiteboard-scenes/
    final.mp4
```

## 실행 원칙

1. `source-whiteboard/` 안에 원본 레포를 준비하고, 해당 레포의 `scripts/prepare_env.py --check`로 환경을 먼저 확인합니다. 필요한 설치나 다운로드는 작업별 폴더 안에서만 수행합니다.
2. `transcript/subtitles.srt`와 `timeline/scenes.json`에서 장면의 순서와 시간을 맞춥니다. 소스 이미지를 준비할 때는 미색 종이 바탕(`#F5EBD7`), 짙은 회색 선, 소량의 빨강·주황·파랑 포인트, 여백 많은 단순 손그림을 사용합니다. 이미지 안 텍스트·숫자·라벨·3D·사진 질감은 사용하지 않습니다.
3. 원본 레포의 확인 게이트를 지킵니다: SRT 기반 장면 전략, 선화, `.annotation.json`과 미리보기, 영역 검사, 최종 시간 표기, 장면 렌더, 다중 장면 합성 순으로 각 단계를 승인받습니다.
4. `.annotation.json`은 실제 이미지의 정수 픽셀 좌표를 사용하고 `sequence`, `subtitle`, `startMs`, `protectedRegions`를 SRT 서사 순서에 맞춥니다. 후속 요소가 미리 노출되지 않도록 보호 영역을 지정합니다.
5. 원본 레포의 `drawing-hand.png`는 보존합니다. 렌더 전에는 펜과 손 모양, 색, 그림자, 투명 배경은 유지하면서 펜대에 있는 중국어만 지운 `assets/whiteboard/drawing-hand-clean.png` 사본을 만들고, 렌더러에는 이 정리본만 전달합니다. 지운 자리가 얼룩지거나 펜의 윤곽이 끊기지 않았는지 확인합니다.
6. 렌더 후 첫 프레임의 빈 종이, 필기 중 보호 영역, 마지막 0.5초 이상의 완성 이미지, 중국어 없는 펜, 최종 MP4의 음성 트랙·길이·0초 시작 오프셋을 검수합니다.
