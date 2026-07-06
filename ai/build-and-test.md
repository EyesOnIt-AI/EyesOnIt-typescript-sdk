# Build And Test

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Typecheck

```bash
npm run typecheck
```

## Tests

```bash
npm test
```

The automated tests include focused API request/response contract snapshots and socket payload parsing fixtures.

## Coverage

```bash
npm run test:coverage
```

## Pack Dry Run

```bash
npm run pack:dry-run
```

This verifies the package contents that would be published without writing a tarball.

## Release Quality Gate

```bash
npm run quality
```

Expected checks:

- TypeScript typecheck with no emit.
- Automated Vitest suite with coverage.
- SDK build for ESM, CJS, and declaration files.
- npm pack dry run for publish contents.

## API Docs

```bash
npm run docs:api
```

## Contract Checks

When backend request/response or socket payloads change, compare SDK types against backend Pydantic/API behavior and update docs.
