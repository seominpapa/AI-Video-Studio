import plan from "./scene-plan.json";
import transcript from "./sentences.json";

export type Sentence = {
  index: number;
  start: number;
  end: number;
  text: string;
  confidence: string;
};

export type ScenePattern =
  | "pain-orbit"
  | "method-split"
  | "situation-map"
  | "workflow"
  | "target-pipeline"
  | "llm-level"
  | "three-tracks"
  | "research-bridge";

export type ScenePlan = {
  id: string;
  start: number;
  end: number;
  sentences: number[];
  title: string;
  subtitle: string;
  pattern: ScenePattern;
  accent: string;
  labels: string[];
};

export const sentences = transcript.sentences as Sentence[];
export const scenes = plan.scenes as ScenePlan[];
export const cues = plan.cues as Record<string, string>;

export const getSceneAt = (time: number) => {
  const active = scenes.find((scene) => time >= scene.start && time < scene.end);
  if (active) {
    return active;
  }
  return [...scenes].reverse().find((scene) => time >= scene.start) ?? scenes[0];
};

export const getSentenceAt = (time: number) => {
  const active =
    sentences.find((sentence) => time >= sentence.start && time < sentence.end) ??
    [...sentences].reverse().find((sentence) => time >= sentence.end);
  return active ?? sentences[0];
};
