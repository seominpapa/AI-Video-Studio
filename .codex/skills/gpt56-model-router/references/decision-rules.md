# GPT-5.6 routing reference

Use this reference only for nuanced routing. It distills the supplied “GPT-5.6 Sol·Terra·Luna 모델 라우터 설계 문서” (2026-07-16) and the current Codex model-selection guidance.

## Tier roles

| Tier | Primary role | Good fits | Avoid when |
|---|---|---|---|
| Luna | speed and cost | routing, classification, short summaries, extraction, support drafts, repetitive automation | task needs complex reasoning or rigorous validation |
| Terra | balanced workhorse | reports, drafting, meeting notes, general RAG, routine automation | the final result carries high consequence or deep technical verification |
| Sol | depth and verification | strategy, coding agents, debugging, architecture, broad research, high-risk analysis | a basic draft or bulk low-risk processing |

## Effort roles

| Effort | Use for |
|---|---|
| low | clear, small, fast tasks |
| medium | normal business and knowledge work; default |
| high | complex analysis, research, strategy, debugging |
| xhigh | difficult technical or high-risk review |
| max | hard problems and critical final validation |
| ultra / multi-agent | independent streams of a large project; reduced wall-clock time may justify extra cost |

## Task starting points

| Task | Start with | Escalate if |
|---|---|---|
| Fast question, translation, short summary | Luna low or Terra low | accuracy requires multi-source synthesis |
| Meeting notes, report draft, routine RAG | Terra medium | material factual or decision risk appears |
| Business plan, strategy comparison, complex research | Terra high | reasoning and validation requirements become substantial; use Sol high |
| Coding agent, debugging, architecture | Sol high or xhigh | repeated failures, difficult edge cases, or final high-impact decision; use Sol max |
| Final decision, hard math/science | Sol max | independent research or implementation streams exist; consider multi-agent |
| Large research or parallel implementation | Sol ultra / multi-agent | only after confirming independent subproblems |

## Escalation and evaluation

Start with the least expensive configuration likely to meet the quality bar. Compare 5–20 representative tasks; record correctness, rework, hallucinations, latency, token cost, and user satisfaction. Escalate for a demonstrated quality miss; downshift when quality is stable and cost or speed matters.

## Project orchestration pattern

Once the user approves execution, the outer root conversation always creates one pinned **project orchestrator** with the recommended tier and effort. The root routes the task and handles user decisions; it does not execute the project payload.

The initial routing result must always disclose the orchestrator model and effort plus a worker decision: `불필요` with a reason, or every proposed worker role with its model, effort, and reason. Missing task detail is not a reason to defer this output; make explicit minimal assumptions, label it provisional, then ask the follow-up question.

The same initial result must include a USD API production-cost range. Use `pricing.md`, split input and output token estimates, calculate each recommended role at its own model rate, and state excluded non-token charges. Do not defer cost because no user-supplied rate is available.

When a project root already has `AGENTS.md` or `.codex/agents/*.toml`, retain its explicit agent roles as the starting structure. Produce a role-by-role current-versus-recommended model/effort comparison, including token and API-cost ranges. Require user approval before changing a named role's configuration; preserve every non-routing setting and report ambiguous file mappings instead of guessing.

The orchestrator has two valid paths:

- **Direct:** execute a tightly coupled project itself, then validate and report it.
- **Delegated:** create workers only for genuinely independent workstreams, then integrate, validate, and report their outputs.

Estimate the orchestrator in every project plan. Add worker, retry, and synthesis overhead only when delegation is used. Parallel workers can shorten wall-clock time, but normally increase aggregate tokens and cost.

## Application boundaries

A skill is an instruction workflow, not an unconditional control plane. It can tell an available Codex agent-spawn mechanism to run a project orchestrator or worker with a pinned model and effort, but it must check that those controls exist. It must never claim a model switch that the current product surface did not confirm.
