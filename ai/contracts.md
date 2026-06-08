# Contracts

## Current Contract Sources

- Backend FastAPI/Pydantic models in `eoi-aas-v5.0`.
- SDK request/response/input/output models in `src/API/`.
- Socket payload types in `src/Socket/`.
- Generated API docs under `generated/docs/` when produced.

## Rules

- Public SDK changes require backend contract notes and docs updates.
- Cross-repo backend/API changes require a central task packet.
- Keep TypeScript and C# SDK models aligned unless a task packet explicitly scopes divergence.

