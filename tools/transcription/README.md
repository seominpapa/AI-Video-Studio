# Local Transcription Tool

이 도구는 Remotion/HyperFrames 영상 제작 전에 `voiceover.wav`에서 문장별 타임코드를 만들기 위한 로컬 전사 파이프라인입니다.

## 1. 설치

최초 1회만 실행합니다. 패키지와 모델은 내려받지만, 음성 파일을 외부 STT 서비스로 업로드하지 않는 로컬 실행 구조입니다.

```powershell
python -m venv .\tools\transcription\.venv
.\tools\transcription\.venv\Scripts\python.exe -m pip install -r .\tools\transcription\requirements.txt
```

## 2. 확인

```powershell
.\tools\transcription\.venv\Scripts\python.exe .\tools\transcription\transcribe.py --check
```

## 3. 전사 실행

작업 폴더 루트에 `voiceover.wav`가 있다는 전제입니다.

```powershell
.\tools\transcription\.venv\Scripts\python.exe .\tools\transcription\transcribe.py `
  --audio .\20260517_직장인AI_PPT_텍스트인포그래픽\voiceover.wav `
  --out .\20260517_직장인AI_PPT_텍스트인포그래픽\transcript `
  --language ko `
  --model small
```

생성 파일:

- `sentences.json`: 영상 타임라인의 기준 파일
- `timeline.json`: 호환용 동일 내용
- `subtitles.srt`: 자막 검수용
- `README.md`: 전사 요약

## 4. 임시 추정 타임라인

로컬 전사 모델이 아직 설치되지 않았고 레이아웃 초안만 필요할 때만 사용합니다. 최종 싱크 기준으로 쓰지 않습니다.

```powershell
.\tools\transcription\.venv\Scripts\python.exe .\tools\transcription\transcribe.py `
  --audio .\작업폴더\voiceover.wav `
  --script .\작업폴더\script.txt `
  --out .\작업폴더\transcript `
  --allow-estimated
```
