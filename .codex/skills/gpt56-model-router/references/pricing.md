# API Production-Cost Rates

Use this reference for every Sol, Terra, or Luna recommendation and adjustment. Rates are USD per 1M text tokens, verified from the official OpenAI model documentation on 2026-07-18. Reasoning tokens are billed as output tokens.

| Tier | API model ID | Input | Cached input | Output |
|---|---|---:|---:|---:|
| Sol | `gpt-5.6-sol` | $5.00 | $0.50 | $30.00 |
| Terra | `gpt-5.6-terra` | $2.50 | $0.25 | $15.00 |
| Luna | `gpt-5.6-luna` | $1.00 | $0.10 | $6.00 |

## Required calculation

For each role, calculate low and high bounds separately:

`cost = (uncached input × input rate + cached input × cached-input rate + output × output rate) / 1,000,000`

Assume cached input is zero unless the plan states otherwise. Sum the role costs for a delegated plan and show the calculation in the initial recommendation. Keep web search, computer use, images, priority processing, and other provider charges outside this number unless they are known.

Call the result `API 제작비용(USD 추정)` or `API-equivalent production cost`; it is not the user's Codex/ChatGPT subscription charge. Check the linked official model pages before changing this table: [Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna).
