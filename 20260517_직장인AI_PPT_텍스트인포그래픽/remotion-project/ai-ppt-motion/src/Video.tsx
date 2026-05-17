import {Audio} from "@remotion/media";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {cues, getSceneAt, getSentenceAt, Sentence, ScenePlan} from "./content";
import "./styles.css";

const CANVAS = "#F4F7F5";
const INK = "#17201D";
const MUTED = "#60716B";
const TEAL = "#0E8F88";
const CORAL = "#E45A3D";
const MUSTARD = "#E9B44C";
const VIOLET = "#5157C9";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const eased = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const AiPptMotion = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const scene = getSceneAt(time);
  const sentence = getSentenceAt(time);
  const localFrame = Math.max(0, frame - Math.round(scene.start * fps));
  const progress = clamp01((time - scene.start) / Math.max(0.01, scene.end - scene.start));

  return (
    <AbsoluteFill className="canvas">
      <Audio src={staticFile("voiceover.wav")} />
      <BackgroundGrid progress={time} />
      <Header scene={scene} localFrame={localFrame} />
      <Infographic scene={scene} sentence={sentence} localFrame={localFrame} progress={progress} />
      <BottomTray sentence={sentence} />
    </AbsoluteFill>
  );
};

const BackgroundGrid = ({progress}: {progress: number}) => {
  const x = (progress * 8) % 80;
  return (
    <div className="background" style={{backgroundColor: CANVAS}}>
      <div className="grid" style={{transform: `translateX(${-x}px)`}} />
      <div className="corner corner-a" />
      <div className="corner corner-b" />
    </div>
  );
};

const Header = ({scene, localFrame}: {scene: ScenePlan; localFrame: number}) => {
  const enter = eased(localFrame, 0, 18);
  return (
    <div className="header" style={{opacity: 0.94 + enter * 0.06, transform: `translateY(${(1 - enter) * -6}px)`}}>
      <div className="eyebrow" style={{color: scene.accent}}>
        {scene.id} / AI PPT STRATEGY
      </div>
      <div className="title">{scene.title}</div>
      <div className="subtitle">{scene.subtitle}</div>
    </div>
  );
};

const BottomTray = ({
  sentence,
}: {
  sentence: Sentence;
}) => {
  const cue = cues[String(sentence.index)] ?? sentence.text;
  return (
    <div className="bottom-tray">
      <div className="cue-block">
        <div className="cue-label">현재 발화 포인트</div>
        <div className="cue-text">{cue}</div>
      </div>
    </div>
  );
};

const Infographic = ({
  scene,
  sentence,
  localFrame,
  progress,
}: {
  scene: ScenePlan;
  sentence: Sentence;
  localFrame: number;
  progress: number;
}) => {
  const active = scene.sentences.indexOf(sentence.index);
  const safeActive = active < 0 ? 0 : active;

  return (
    <div className="graphic-stage">
      {scene.pattern === "pain-orbit" && <PainOrbit scene={scene} localFrame={localFrame} active={safeActive} />}
      {scene.pattern === "method-split" && <MethodSplit scene={scene} progress={progress} />}
      {scene.pattern === "situation-map" && <SituationMap scene={scene} localFrame={localFrame} active={safeActive} />}
      {scene.pattern === "workflow" && <Workflow scene={scene} progress={progress} />}
      {scene.pattern === "target-pipeline" && <TargetPipeline scene={scene} progress={progress} />}
      {scene.pattern === "llm-level" && <LlmLevel scene={scene} localFrame={localFrame} active={safeActive} />}
      {scene.pattern === "three-tracks" && <ThreeTracks scene={scene} progress={progress} active={safeActive} />}
      {scene.pattern === "research-bridge" && <ResearchBridge scene={scene} progress={progress} />}
    </div>
  );
};

const LabelPill = ({label, color, active = true}: {label: string; color: string; active?: boolean}) => (
  <div className="label-pill" style={{borderColor: color, opacity: active ? 1 : 0.42}}>
    <span className="label-dot" style={{backgroundColor: color}} />
    {label}
  </div>
);

const PainOrbit = ({scene, localFrame, active}: {scene: ScenePlan; localFrame: number; active: number}) => {
  const enter = eased(localFrame, 0, 24);
  const cards = [
    {x: 120, y: 82, color: CORAL},
    {x: 1180, y: 74, color: VIOLET},
    {x: 210, y: 390, color: MUSTARD},
    {x: 1120, y: 390, color: TEAL},
  ];
  return (
    <div className="stage-inner">
      <div className="ppt-core" style={{transform: `scale(${0.92 + enter * 0.08})`}}>
        <div className="ppt-lines">
          <span />
          <span />
          <span />
        </div>
        <div className="ppt-chart">
          <i style={{height: 80, backgroundColor: TEAL}} />
          <i style={{height: 128, backgroundColor: MUSTARD}} />
          <i style={{height: 56, backgroundColor: CORAL}} />
        </div>
        <div className="ppt-caption">PPT 결과물</div>
      </div>
      {scene.labels.map((label, index) => (
        <div
          className="problem-card"
          key={label}
          style={{
            left: cards[index].x,
            top: cards[index].y,
            borderColor: cards[index].color,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 30}px) scale(${active === index ? 1.06 : 1})`,
          }}
        >
          <div className="problem-mark" style={{color: cards[index].color}}>
            {index + 1}
          </div>
          <div>{label}</div>
        </div>
      ))}
    </div>
  );
};

const MethodSplit = ({scene, progress}: {scene: ScenePlan; progress: number}) => {
  const path = clamp01(progress * 1.4);
  return (
    <div className="stage-inner split-layout">
      <div className="split-node source">AI 도구</div>
      <div className="split-line">
        <div className="split-line-fill" style={{width: `${path * 100}%`}} />
      </div>
      <div className="split-warning" style={{opacity: clamp01((progress - 0.22) * 4)}}>
        방식 오류
      </div>
      <div className="split-node result">발표자료</div>
      <div className="split-labels">
        {scene.labels.map((label, index) => (
          <LabelPill key={label} label={label} color={[MUTED, TEAL, CORAL][index]} active={progress > index * 0.22} />
        ))}
      </div>
    </div>
  );
};

const SituationMap = ({scene, localFrame, active}: {scene: ScenePlan; localFrame: number; active: number}) => {
  const enter = eased(localFrame, 0, 22);
  const nodes = [
    {x: 240, y: 70, color: TEAL},
    {x: 1080, y: 70, color: VIOLET},
    {x: 240, y: 340, color: MUSTARD},
    {x: 1080, y: 340, color: CORAL},
  ];
  return (
    <div className="stage-inner">
      <svg className="connector-map" viewBox="0 0 1600 560">
        <path d="M440 160 C620 210 820 210 1060 160" />
        <path d="M440 430 C620 365 820 365 1060 430" />
        <path d="M380 230 C500 290 500 330 380 380" />
        <path d="M1220 230 C1090 290 1090 330 1220 380" />
      </svg>
      <div className="map-center" style={{transform: `scale(${0.9 + enter * 0.1})`}}>
        같은 방식
      </div>
      {scene.labels.map((label, index) => (
        <div
          className="map-node"
          key={label}
          style={{
            left: nodes[index].x,
            top: nodes[index].y,
            borderColor: nodes[index].color,
            boxShadow: active === index ? `0 0 0 10px ${nodes[index].color}22` : "none",
          }}
        >
          <span style={{backgroundColor: nodes[index].color}} />
          {label}
        </div>
      ))}
    </div>
  );
};

const Workflow = ({scene, progress}: {scene: ScenePlan; progress: number}) => {
  return (
    <div className="stage-inner workflow">
      {scene.labels.map((label, index) => {
        const active = progress > index / scene.labels.length - 0.03;
        return (
          <div className="workflow-step" key={label} style={{borderColor: active ? scene.accent : "#C8D3CE"}}>
            <div className="step-number" style={{backgroundColor: active ? scene.accent : "#C8D3CE"}}>
              {index + 1}
            </div>
            <div>{label}</div>
          </div>
        );
      })}
      <div className="workflow-arrow" style={{width: `${progress * 1280}px`, backgroundColor: scene.accent}} />
    </div>
  );
};

const TargetPipeline = ({scene, progress}: {scene: ScenePlan; progress: number}) => {
  return (
    <div className="stage-inner target-layout">
      <div className="target">
        <div className="target-ring ring-a" />
        <div className="target-ring ring-b" />
        <div className="target-dot" style={{backgroundColor: scene.accent}} />
        <div className="target-label">결과물</div>
      </div>
      <div className="pipeline">
        {scene.labels.map((label, index) => (
          <div className="pipeline-node" key={label} style={{opacity: progress > index * 0.24 ? 1 : 0.35}}>
            <span style={{backgroundColor: [MUSTARD, TEAL, VIOLET][index]}} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const LlmLevel = ({scene, localFrame, active}: {scene: ScenePlan; localFrame: number; active: number}) => {
  return (
    <div className="stage-inner llm-layout">
      {scene.labels.map((label, index) => {
        const rise = eased(localFrame, index * 5, index * 5 + 24);
        return (
          <div className="llm-column" key={label}>
            <div className="llm-bar-wrap">
              <div
                className="llm-bar"
                style={{
                  height: `${120 + rise * (180 - index * 15)}px`,
                  backgroundColor: [TEAL, VIOLET, MUSTARD, CORAL][index],
                  opacity: active === index || active >= 3 ? 1 : 0.72,
                }}
              />
            </div>
            <div className="llm-label">{label}</div>
          </div>
        );
      })}
      <div className="level-line">PPT 제작 능력 평준화</div>
    </div>
  );
};

const ThreeTracks = ({scene, progress, active}: {scene: ScenePlan; progress: number; active: number}) => {
  return (
    <div className="stage-inner tracks">
      {scene.labels.map((label, index) => {
        const color = [TEAL, MUSTARD, CORAL][index];
        return (
          <div className="track" key={label} style={{borderColor: color, opacity: progress > index * 0.16 ? 1 : 0.28}}>
            <div className="track-number" style={{backgroundColor: color}}>
              {index + 1}
            </div>
            <div className="track-title">{label}</div>
            <div className="track-rail">
              <div className="track-fill" style={{width: active >= index ? "100%" : "36%", backgroundColor: color}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ResearchBridge = ({scene, progress}: {scene: ScenePlan; progress: number}) => {
  const width = `${clamp01(progress * 1.2) * 100}%`;
  return (
    <div className="stage-inner research">
      <div className="research-node left">
        <div className="book-lines">
          <span />
          <span />
          <span />
        </div>
        {scene.labels[0]}
      </div>
      <div className="bridge">
        <div className="bridge-fill" style={{width, backgroundColor: scene.accent}} />
      </div>
      <div className="research-node center">{scene.labels[1]}</div>
      <div className="bridge bridge-b">
        <div className="bridge-fill" style={{width, backgroundColor: TEAL}} />
      </div>
      <div className="research-node right">
        <div className="mini-slides">
          <span />
          <span />
          <span />
        </div>
        {scene.labels[2]}
      </div>
      <div className="cta-chip">{scene.labels[3]}</div>
    </div>
  );
};
