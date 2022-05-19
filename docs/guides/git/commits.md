---
icon: git-commit
---

# Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), so that commit messages are clean and concise. They should follow a consistent structure, being written in present-tense and using the prefixes below:

- `chore`: modifies documentation, cleaning dependencies, other housekeeping-like tasks
- `ci`: creates or changes an existing continuous integration workflow (checkout `ci.*.yml` files in [`firefly/.github/workflows/`](https://github.com/iotaledger/firefly/tree/develop/.github/workflows))
- `feat`: introduces a new feature or enhancement of an existing feature
- `fix`: fixes or patches a bug in app functionality
- `refactor`: improvements made to existing code
- `style`: adjusts component styling or UI-only changes
- `test`: changes made _only_ to unit or integration tests

An example might be: `feat: Add conversion function for IOTA to fiat currency`

The granularity of the commits are ultimately up to you, however we prefer keeping the number of commits lower if possible. The commits are squashed in the end as a change-log / summary of the PR, so do not worry too much.
