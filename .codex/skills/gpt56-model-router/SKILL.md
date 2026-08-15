---
name: gpt56-model-router
description: Recommend and apply an appropriate GPT-5.6 Sol, Terra, or Luna model and reasoning effort for a new project or task. Use when a user starts work and needs an easy explanation of the best model, reasoning level, rationale, project time/input-output-token/API-cost estimate, quality-first alternative, adaptive error-driven adjustment policy, or a Codex project-orchestrator handoff with a generated pinned agent configuration.
---

# GPT-5.6 Model Router

Help users start projects with enough capability, without paying for more reasoning than the work needs. Explain choices in plain Korean when the user writes Korean; otherwise mirror the user's language.

## Gather only the missing facts

If the task description already answers a question, do not ask it again. Use these six facts when available:

1. What outcome should the project produce?
2. How difficult is it: simple, normal, complex, or a hard problem?
3. What happens if the result is wrong: low, medium, high, or critical impact?
4. Is speed important: immediate, seconds, or minutes are acceptable?
5. Is this a one-off, repeatable work, or high-volume processing?
6. Does it need tools, coding, or independently parallelizable subprojects?

Treat security or personal-data sensitivity as a handling constraint, not by itself as a reason to select a stronger model. If a material fact is missing, make a minimal stated assumption and present the required provisional recommendation and role table first; ask the compact refinement question afterward.

If the user says “recommend for me” without answers, use **Terra + medium** as the provisional choice and label it provisional. Do not block a simple start on a long interview.

## Reuse existing project agent roles

Before the first recommendation, inspect only the current project root's `AGENTS.md` and `.codex/agents/*.toml` files. Read [existing-agent-routing.md](references/existing-agent-routing.md) when either location exists. Do not inspect or alter `~/.codex/agents/` unless the user explicitly requests a cross-project setting.

When existing roles are found, treat their responsibilities as the project structure to optimize. Identify the project orchestrator and every explicit worker role; show unmapped or ambiguous roles rather than guessing. If no existing orchestrator is defined, include one proposed project-orchestrator role as required by this skill.

In the first recommendation, add a `기존 역할별 권장 설정` table before any follow-up question. For every role, show: role, source (`AGENTS.md` or config file), current model+effort or `미설정`, recommended model+effort, reason, input/output token range, and USD API production-cost range. Preserve the mandatory `프로젝트 총괄`, `하위 에이전트`, and aggregate `API 제작비용` fields as the summary of that table.

Do not change a discovered role, `AGENTS.md`, or agent configuration merely by making the recommendation. After the user explicitly approves selected roles or says “모든 권장 역할 적용”, modify only those roles. For an approved matching `.toml`, change only `model` and `model_reasoning_effort`, preserving its name, instructions, and other settings. If an approved role from `AGENTS.md` has no matching `.toml`, create a clearly generated companion configuration for that role. If a role-to-file mapping is ambiguous, report it and wait for the user to select the target file; never overwrite by guesswork.

## Choose the model tier first

Read [decision-rules.md](references/decision-rules.md) when a borderline case, scoring rationale, or exact task mapping is needed.

- Choose **Luna** for simple, low-risk, high-volume or latency-sensitive work: classification, routing, extraction, translation, short summaries, or customer-support drafts.
- Choose **Terra** as the normal default for documents, reports, standard RAG answers, meeting notes, ordinary automation, and most project work.
- Choose **Sol** for complex reasoning, engineering agents, debugging, architecture, strategy, broad research, difficult math/science, or decisions with high failure cost.
- Escalate Terra to Sol when quality failure needs substantial rework, a human is about to make a consequential decision, or tool-based verification is central to success.
- Do not choose Sol merely to make an ordinary draft sound better. Do not choose Luna for complex synthesis or high-stakes validation.

## Choose reasoning effort after the model

- **low**: straightforward, bounded tasks where speed matters.
- **medium**: balanced default for most work.
- **high**: multi-step analysis, strategy comparisons, complex research, or nontrivial debugging.
- **xhigh**: architecture review, difficult debugging, high-risk analysis, or advanced technical validation.
- **max**: a genuinely hard problem or critical final review where extra verification is worth the delay and cost.
- **ultra / multi-agent**: only when the task can be split into independent pieces and shorter elapsed time matters. Treat it as a parallel-workflow choice, not a universal effort setting.

Avoid Luna at xhigh/max/ultra. Treat Terra at max or ultra as a signal to compare Sol instead. Prefer testing Terra high before Sol when the task is important but not clearly high-stakes.

## Estimate before explaining

Read [estimation.md](references/estimation.md) and [pricing.md](references/pricing.md) before presenting project estimates or alternatives. Use ranges, not a single promised number.

State the assumptions that materially affect the estimate: deliverables, amount/quality of input context, tool or test time, review cycles, and whether workstreams are independent. Estimate all of the following:

- **Elapsed time**: likely wall-clock range from start to a reviewable result.
- **Tokens**: separate aggregate **input** and **output** token ranges for the project orchestrator, its workers, retries, verification, and synthesis. If outer root-conversation overhead is material, label it separately rather than hiding it in the project estimate.
- **API production cost**: always calculate a USD range from the applicable Sol, Terra, or Luna input/output rates in `pricing.md`. Show the token assumptions and formula. Assume uncached input unless cached input is known. Keep external tool/provider charges separate and never invent them.

Every accepted project starts with one pinned **project orchestrator** using the recommended model and effort. The orchestrator works directly when no independent workstream exists; otherwise it delegates only independent parts, then integrates and validates their results. For a worker plan, show the direct-orchestrator baseline and the proposed worker roles. Explain that parallelism can reduce elapsed time while increasing aggregate tokens and cost. Include each role's model and effort, its reason, and the plan-level elapsed-time, total-token, and cost range.

**Mandatory first-response rule:** In the first routing response, always show a concrete `프로젝트 총괄` model+effort recommendation and a concrete `하위 에이전트` plan. The worker plan must say either `불필요` with the reason, or list every proposed role with its model+effort and reason. Do this before asking any follow-up question. When the project brief is incomplete, make minimal stated assumptions and label the recommendation `잠정안`; do not withhold the agent configuration while waiting for more detail. A follow-up question may refine the plan, but must never replace this initial output.

Retain the recommended setting and estimate as the comparison baseline.

## Explain the recommendation

Return this short, user-friendly structure:

```text
추천: [모델] + [추론강도]
한 줄 이유: [난이도·실패 비용·속도·반복량을 연결한 설명]
예상: [가정] · 완료 시간 [범위] · 입력 [범위] · 출력 [범위]
API 제작비용: $[범위] — [모델별 입력·출력 단가와 계산식]
프로젝트 총괄: [모델+추론강도] — [전체 작업·통합·검증 책임]
하위 에이전트: [불필요 / 역할·각 모델+추론강도·추천 이유] · 시간·토큰·비용 영향
품질 우선안: [더 높은 조합] — [언제 필요한지]
적용: [자동 위임 가능 여부 또는 사용자가 선택할 위치]
검증: 대표 작업 5~20개로 품질, 재작업률, 시간, 비용을 비교
조정 정책: [고정 / 첫 조정 시 확인 / 자동 조정] 중 하나를 선택해 주세요.
```

The `프로젝트 총괄`, `하위 에이전트`, and `API 제작비용` lines are mandatory, not optional examples. Never replace any of them with a question, “추가 정보 필요”, or a generic statement. If no worker is justified, write `하위 에이전트: 불필요 — [tightly coupled work reason]`. For these three GPT-5.6 tiers, never write `단가 필요`; use `pricing.md`.

Do not include time-saving or token-saving alternatives in the initial recommendation. Present model/effort adjustment options only after a qualified repeated-error or rework signal, or when the user explicitly asks to change settings. For every adjustment, give the reason and expected quality, time, token, and cost impact.

Do not expose an internal scoring formula unless the user asks. Never present a cost, token, time, or quality guarantee. State assumptions briefly when information is missing.

## Choose the adjustment policy once

After presenting the initial recommendation, ask the user to choose exactly one policy. Do not ask follow-up policy questions later.

- **Fixed**: retain the recommended model and effort for the project.
- **Confirm once**: on the first qualified adjustment signal, show one adjustment proposal and ask for approval. If approved, apply comparable later adjustments automatically within that role's approved scope; if declined, lock the original setting for the project.
- **Automatic**: evaluate qualified signals and apply justified changes automatically to the next work unit, a replacement project orchestrator, or a new pinned worker. For existing role configurations, this applies only to roles the user previously approved for routing changes.

Record the choice in the project adjustment state when the current surface supports it. Do not create recurring time-based monitoring.

## Evaluate error and rework signals

Read [adjustment-workflow.md](references/adjustment-workflow.md) when a user requests an adjustment or a qualified signal occurs: the same acceptance test fails twice, the same error recurs after a fix, the same acceptance criterion needs two rework cycles, or a subagent result fails acceptance. Do not treat a one-off failure or an external-tool outage as a qualified signal.

Compare observed evidence with the baseline: acceptance or test results, concrete errors, user-requested rework, elapsed time, available usage data, and the remaining work's complexity, failure cost, and independence. Treat unavailable token data as an estimate, not a measurement.

Change one dimension first: raise effort for quality/rework problems, lower effort for cost/latency with acceptable quality, then change the model tier only if evidence supports it. For independent bottlenecks, propose a parallel subagent plan instead. Report the previous and proposed model/effort, reason, evidence, expected quality/time/token/cost effect, and application boundary. After a change, wait for the next validation result before making another adjustment.

Apply the policy: fixed means report only; confirm-once asks only at the first qualified signal; automatic applies the justified setting within the user's approved role scope. Apply changes only to the next work unit, a replacement project orchestrator, or a new pinned worker when the current Codex surface supports it. Do not switch the running root agent.

## Offer a pinned Codex project orchestrator

After every non-provisional recommendation, offer this next step in plain language: **“권장 설정의 프로젝트 총괄 에이전트에게 작업을 위임해 바로 시작할까요?”** If the project has no existing role configuration, a start/proceed/apply approval creates the generated pinned orchestrator. If existing role configurations are present, ask the user to approve the named roles or say **“모든 권장 역할 적용”** before changing them; a bare start/proceed approval does not overwrite those files.

Do not change the current root conversation's model. The root routes the task, receives status, and handles user decisions; it does not perform the project payload. Always create the project orchestrator first so its model and reasoning settings are explicit and reproducible. This applies whether the orchestrator later works alone or creates workers.

## Create and run the pinned project orchestrator

1. Check that the current Codex surface supports the recommended model and effort. Do not substitute another model silently.
2. Create `.codex/agents/` in the current project if needed. Use the personal directory `~/.codex/agents/` only when the user explicitly asks for a cross-project default.
3. If the approved project has no existing role configuration, write `.codex/agents/gpt56-router-<tier>-<effort>.toml`, replacing `<tier>` and `<effort>` with the recommendation. If an approved existing role has a mapped configuration, update only its `model` and `model_reasoning_effort`; if it has no configuration, create a generated companion role configuration as specified in `existing-agent-routing.md`. Use the current model ID and effort in this template:

```toml
# Generated by gpt56-model-router for this project.
name = "gpt56-router-<tier>-<effort>"
description = "Pinned <tier> / <effort> project orchestrator generated for this project."
developer_instructions = "Own the delegated project end to end. Work directly when it is tightly coupled. Delegate only independent workstreams when useful, then integrate and validate every result. Follow the acceptance criteria. Report completed work, validation, and unresolved risks to the root agent."
model = "gpt-5.6-<tier>"
model_reasoning_effort = "<effort>"
```

4. If a generated router file already exists, update it to the approved recommendation. Never modify a non-generated agent file without the user's explicit approval of that named role; never overwrite a non-generated file when the role/file mapping is unclear.
5. Spawn the project orchestrator by its custom-agent name when the current agent-creation surface supports named custom agents. Otherwise spawn with the same `model` and `model_reasoning_effort` passed directly to the available spawn control.
6. Give the orchestrator the user task, acceptance criteria, relevant project context, routing rationale, and chosen adjustment policy. Report the config path and exact pinned settings before work begins.
7. The orchestrator must choose one of two paths: execute the tightly coupled project directly, or identify independent workstreams and create workers only for those roles. It remains responsible for integration, validation, and the final project report in both paths. For **ultra / multi-agent**, create one pinned worker setting per role only when the available surface supports the required effort; otherwise state that the setting cannot be applied automatically and use the closest supported orchestrator-led plan.

Create a new generated configuration only after the user asks to start, proceed, apply, or explicitly requests configuration changes. Modify an existing role configuration only after the user approves that named role or all recommended roles. Do not change global defaults, billing, API keys, or account settings.

If the recommended Luna, max, or ultra setting is unavailable in the current agent controls, preserve the recommendation and ask the user to select it manually. Do not claim that a configuration file or a worker changed the setting unless the creation surface confirms it.

## Calibrate with results

After a representative run, adjust one dimension at a time:

- Quality, correctness, or rework failure: increase effort first, then escalate Terra to Sol.
- Excess delay or cost with acceptable quality: reduce effort first, then move Sol to Terra or Terra to Luna.
- A decomposable project that is slow: consider multi-agent work; do not use it for a single tightly coupled question.

Keep the user's chosen quality, latency, and budget priorities above the default rules.
