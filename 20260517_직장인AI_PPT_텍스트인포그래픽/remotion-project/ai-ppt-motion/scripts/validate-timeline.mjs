import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const transcriptPath = path.join(root, "src", "sentences.json");
const planPath = path.join(root, "src", "scene-plan.json");
const videoPath = path.join(root, "src", "Video.tsx");

const transcript = JSON.parse(fs.readFileSync(transcriptPath, "utf8"));
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const sentences = transcript.sentences;
const scenes = plan.scenes;
const cues = plan.cues;
const videoSource = fs.readFileSync(videoPath, "utf8");
const frameDuration = 1 / 30;

const fail = (message) => {
  throw new Error(message);
};

if (!Array.isArray(sentences) || sentences.length === 0) {
  fail("sentences.json has no transcript sentences");
}

if (!Array.isArray(scenes) || scenes.length === 0) {
  fail("scene-plan.json has no scenes");
}

const seen = new Set();
for (const sentence of sentences) {
  if (!Number.isFinite(sentence.start) || !Number.isFinite(sentence.end)) {
    fail(`sentence ${sentence.index} has invalid timestamps`);
  }
  if (sentence.end <= sentence.start) {
    fail(`sentence ${sentence.index} ends before it starts`);
  }
  if (!cues[String(sentence.index)]) {
    fail(`sentence ${sentence.index} has no display cue`);
  }
}

for (let i = 0; i < scenes.length; i += 1) {
  const scene = scenes[i];
  if (i > 0 && scene.start < scenes[i - 1].end) {
    fail(`${scene.id} overlaps the previous scene`);
  }
  if (i > 0) {
    const gap = scene.start - scenes[i - 1].end;
    if (gap > frameDuration + 0.001) {
      fail(`${scenes[i - 1].id} -> ${scene.id} has a visual scene gap of ${gap.toFixed(3)}s`);
    }
  }
  for (const index of scene.sentences) {
    if (seen.has(index)) {
      fail(`sentence ${index} is assigned to more than one scene`);
    }
    seen.add(index);
  }
  const sceneSentences = scene.sentences.map((index) => sentences.find((sentence) => sentence.index === index));
  if (sceneSentences.some((sentence) => !sentence)) {
    fail(`${scene.id} references a missing sentence`);
  }
  const first = sceneSentences[0];
  const last = sceneSentences[sceneSentences.length - 1];
  if (Math.abs(scene.start - first.start) > 0.08) {
    fail(`${scene.id} does not start at its first sentence timestamp`);
  }
  const expectedEnd = scenes[i + 1]?.start ?? last.end;
  if (Math.abs(scene.end - expectedEnd) > 0.08) {
    fail(`${scene.id} end should cover silence until ${expectedEnd.toFixed(2)}s`);
  }
}

for (const sentence of sentences) {
  if (!seen.has(sentence.index)) {
    fail(`sentence ${sentence.index} is not assigned to any scene`);
  }
}

const lastEnd = sentences.at(-1).end;
const duration = Math.ceil((lastEnd + 1.1) * 30);
if (videoSource.includes('className="time-block"') || videoSource.includes("formatClock(")) {
  fail("final video source still contains debug time/progress UI");
}
console.log(`timeline ok: ${sentences.length} sentences, ${scenes.length} scenes, ${duration} frames`);
