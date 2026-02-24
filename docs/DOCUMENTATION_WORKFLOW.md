# TypeScript SDK Documentation Workflow

This repository now supports generated API reference documentation using TypeDoc + TSDoc comments.

## What Is Generated

- Markdown reference pages for public SDK classes, methods, and properties.
- Output directory: `generated/docs/sdk-api`

## Commands

```bash
npm run docs:api
```

This command:
- Deletes previous generated API reference markdown
- Regenerates SDK reference docs from code comments

## Source Of Truth

- Keep method and model descriptions in code via TSDoc comments.
- Keep conceptual guides and tutorials hand-written in your website docs repo.

## Docusaurus Integration

Use one of these patterns in your website repository:

1. Copy generated files into a docs section:
- Source: `generated/docs/sdk-api`
- Destination example: `docs/typescript-sdk/api-reference`

2. Pull this SDK repo as a dependency in your docs build and copy during CI.

3. Add a docs sidebar category called `TypeScript SDK` with:
- `Getting Started` (hand-written)
- `API Reference` (generated markdown)
- `Examples` (hand-written recipes)

## Update Cadence

- On every SDK PR that changes public types or methods:
1. Update TSDoc comments
2. Run `npm run docs:api`
3. Publish SDK + website docs together (same release notes)
