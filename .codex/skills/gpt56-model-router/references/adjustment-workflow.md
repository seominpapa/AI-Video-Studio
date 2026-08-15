# Adjustment Workflow

Ask for the adjustment policy once after the initial recommendation: `fixed`, `confirm once`, or `automatic`. Keep the initial model, effort, and estimates as the baseline.

## Qualified signals

Evaluate only when the user asks or one of these signals occurs:

- the same acceptance test fails twice;
- the same error returns after an attempted fix;
- the same acceptance criterion needs two rework cycles; or
- a project-orchestrator worker result fails its acceptance criteria.

Ignore a one-off failure and an external-service, network, permission, or rate-limit outage unless it repeats after recovery.

## Choose one adjustment

- Quality, correctness, or rework issue: raise effort first; then move Luna to Terra or Terra to Sol only when capability is the likely constraint.
- Time or token issue with acceptable quality: lower effort first; then consider Sol to Terra or Terra to Luna.
- Independent schedule bottleneck: let the project orchestrator propose parallel workers, while stating that aggregate tokens and cost can rise.

After one adjustment, wait for the next validation result before adjusting again.

## Report and apply

Report the old and proposed model/effort, evidence, reason, predicted quality/time/token/cost effect, uncertainty, and application boundary. Split input and output token estimates and calculate the old/proposed USD API production-cost range with `pricing.md`; identify excluded non-token charges. `fixed` reports only. `confirm once` asks for approval on the first qualified signal only, then preserves approval or rejection for the project. `automatic` applies a justified setting without another question only within roles the user previously approved for routing changes.

Apply only to the next work unit, a replacement pinned project orchestrator, or a new pinned worker supported by the current surface. When existing role configurations are present, update only the explicitly approved role's `model` and `model_reasoning_effort`; preserve all other fields and never modify `AGENTS.md` as a routing side effect. Do not switch a running root agent; it remains the routing and approval layer.
