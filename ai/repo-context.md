# EyesOnIt TypeScript SDK Repo Context

## Purpose

This repo contains the TypeScript SDK for EyesOnIt API and socket integrations.

## Runtime And Stack

- TypeScript SDK package.
- Build tool: `tsup`.
- API documentation: TypeDoc.
- Published package entrypoints are under `dist/`.

## Key Entry Points

- Package manifest: `package.json`.
- Source API client and models: `src/API/`.
- Socket client: `src/Socket/`.
- API docs config: `typedoc.json`.

## Related Repos

- Backend API source: `../eoi-aas-v5.0`.
- React UI consumes this SDK through a local file dependency.
- C# SDK should stay contract-aligned with this SDK.

