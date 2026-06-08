# EyesOnIt TypeScript SDK Agent Rules

The central rules in `../eoi-ai-factory/standards/ai-agent-rules.md` apply when repos are checked out as siblings under `$EOI_WORKSPACE`.

## Repo-Specific Rules

- Keep public SDK types and method signatures aligned with backend API contracts.
- Do not change public API behavior without documenting backend, C# SDK, UI, and docs impact.
- Do not hardcode hostnames, credentials, license keys, tokens, customer IDs, or environment values.
- Do not add dependencies without dependency/license review.
- Generated docs should reflect exported public SDK types.

