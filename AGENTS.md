# AGENTS.md

## Repository status

This is a dormant repository maintained only for baseline dependency and security remediation.

## Primary goal

Reduce dependency risk with minimal human intervention. GitHub is the canonical copy.

## Update policy

- Update outdated and vulnerable dependencies.
- Major version upgrades are allowed.
- Refresh lockfiles after dependency changes.
- Attempt to satisfy peer dependency requirements through normal package manager resolution.
- Avoid broad refactors.
- Only change application code if required to complete dependency installation.

## Validation

- Run dependency installation only.
- Do not require test, lint, typecheck, or build validation.
- If install fails, summarize the failure and still prepare a useful PR when possible.

## Change boundaries

- Prefer edits to dependency manifests, lockfiles, and minimal compatibility changes.
- Do not add product features.
- Do not redesign the app.
- Do not reorganize the repository unless necessary.

## PR summary format

Include:

1. Package manager detected
2. Dependency manifest changes
3. Lockfile changes
4. Any peer dependency warnings or conflicts
5. Any source files changed beyond dependency manifests and lockfiles
6. Install result
