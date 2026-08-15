# Agent Guidance

When responding to a project model-routing request, the **first response must** give a user-readable recommendation with the model, reasoning effort, and a concrete reason tied to complexity, failure cost, speed, scale, and tool use. It must explicitly include both `프로젝트 총괄: <model> + <effort>` and `하위 에이전트: <불필요 또는 역할별 model + effort>`; these are required output fields, not questions to defer. When details are missing, use minimal stated assumptions, label the plan `잠정안`, and ask any refinement question only after presenting the configuration.

Before that response, inspect the current project root's `AGENTS.md` and `.codex/agents/*.toml` when they exist. Read `references/existing-agent-routing.md`. Existing explicit roles are the default structure: show a `기존 역할별 권장 설정` table for the orchestrator and every worker, with current setting, recommended setting, reason, input/output tokens, and USD API production cost. Do not infer a role-to-file mapping when it is ambiguous.

Always include bounded estimates with their assumptions:

- elapsed time to the stated delivery boundary;
- separate aggregate input and output token ranges, including verification and rework; and
- a USD API production-cost range calculated from `references/pricing.md` for every Sol, Terra, or Luna recommendation. Show the input/output token assumptions and formula; assume uncached input unless caching is known. Keep external tool/provider charges separate.

`API 제작비용` is a required field in the first recommendation and in every settings-adjustment comparison. Do not output `단가 필요` for the three configured GPT-5.6 tiers. Clearly label this as API-equivalent production cost, not a Codex subscription charge.

After the user approves execution, the root must always delegate the project to one pinned project orchestrator using the recommended model and effort. The root only routes, reports status, and handles user decisions. The orchestrator performs tightly coupled work directly; if it proposes workers, first confirm that workstreams are independent. It remains responsible for integration and final validation. In the initial recommendation, state either that workers are unnecessary and why, or state every worker role, its model and reasoning effort, and the reason for the split. Include plan-level elapsed-time, total-token, and cost ranges, and compare delegated work with an orchestrator-only baseline, since parallel work can shorten the critical path but usually raises aggregate tokens and cost.

Do not modify `AGENTS.md` as part of a model recommendation. Change only `model` and `model_reasoning_effort` in a matching role configuration after the user explicitly approves that role or all recommended roles. Preserve all other fields. For an approved role with no configuration, create a clearly generated companion file; never alter global agent settings unless explicitly requested.

Do not include time-saving or token-saving alternatives in the initial recommendation. Present a model/effort adjustment only after a qualified repeated-error or rework signal, or when the user explicitly requests a change. Include its reason and predicted quality, elapsed-time, total-token, and cost impact. Do not recommend changes that violate stated quality, risk, privacy, or deadline requirements.

Use ranges and label uncertainty; never promise time, tokens, cost, or quality. Read `references/estimation.md` for the complete estimation method.

After presenting the initial recommendation, require one adjustment-policy choice: `fixed`, `confirm once`, or `automatic`. Do not ask further policy questions. Retain the initial recommendation as the baseline.

Evaluate only a user request or a qualified signal: the same acceptance test fails twice, the same error returns after a fix, the same acceptance criterion needs two rework cycles, or a subagent fails acceptance. Ignore one-off failures and external-tool outages. Compare acceptance/test results, concrete errors, rework, elapsed time, available usage data, and the remaining work's complexity, failure cost, and independence. If token data is unavailable, label the result as an estimate.

Before changing settings, report the old and proposed model/reasoning effort, evidence and reason, predicted quality/time/token/cost impact, and whether it applies to the next work unit, a replacement project orchestrator, or a new worker. Apply `fixed` as report-only; ask exactly once for `confirm once`, then honor its approval or rejection for the rest of the project; apply justified settings automatically for `automatic` only within roles the user previously approved for routing changes. Adjust one dimension at a time: effort before model tier; use parallel workers only for independent bottlenecks; wait for validation before another adjustment. Never change the running root agent. Read `references/adjustment-workflow.md` for the complete workflow.
