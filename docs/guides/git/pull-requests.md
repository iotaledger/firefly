---
icon: git-pull-request
---

# Pull Requests

## Creating

### When to create a Pull Request

You can create a PR at any time for an existing issue. If the work is not yet in a position to be reviewed then ensure that you create the PR as a draft.

A PR should have exactly one concern (i.e. a feature or a bug). A PR that addresses more than one concern should ideally be split into multiple PRs.

### What information to add to the Pull Request

When creating the PR, you will be presented with our current template; it is advisable to fill this template in as detailed as possible, and to the best of your ability. This will allow for a smoother review process, and high probability of your branch being merged.

You should also assign the PR to yourself, add the appropriate labels, link any relevant issues to be closed and if known, request a review of a maintainer.

### How to format a Pull Request

It is important to keep the formatting of PRs clean and consistent. In addition to generally following the template, we also use the following rules:

- PR titles __must__ be in the format `type: the title of the PR`.
  - All words __must__ be lowercase _except_ proper nouns (e.g. "Electron", "Stronghold") and acronyms (e.g. "API").
  - All code or package names __should__ be formatted as `inline code`. This is best for things like dependencies as specific variable names are subject to change.
- Instructional text (like [this](https://github.com/iotaledger/firefly/blob/develop/.github/pull_request_template.md?plain=1#L13)) in the template __should__ be removed in PR descriptions.

### What labels to use

Please ensure all PRs have a ___type___ label, additional labels can be added where deemed appropriate.

#### Type Labels

- `feat`: Introduces a new feature
- `enhancement`: Enhancement of an existing feature
- `refactor`: Improvements made to existing code
- `chore`: Modifies documentation, cleaning dependencies, or other housekeeping-like tasks
- `fix`: Bug, error, or failure that has been fixed

#### Status Labels

- `do not merge`: Do not merge into any working branches

## Reviewing

### Requesting a review

Before requesting a review please make sure:

1. You have completed the task defined in the issue.
1. If you've added code that should be tested, add tests.
2. Ensure the test suite passes.
3. Make sure your code lints.
4. A PR should have exactly one concern (i.e. one feature or one bug).
5. All code should follow the [coding guide](https://github.com/iotaledger/firefly/wiki/Coding-Guide).  

Once your PR fulfils the above criteria, you are free to request a review from one of the maintainers.

### Completing a review

There are no limitations on who can review a PR, the more eyes on the code the better. All maintainers, Firefly developers and contributors are encouraged to review as many PRs as possible, as well as community members.

At a minimum, it is advised to do the following during a review:

- Read the lined issues and PR description to get context for the review
- Pull the branch to your local machine and build the application
- Manually test the application, focusing on any new features or fixes that have been added
- Review the code that has been added or changed
- Add feedback in the form of comments, utilising the GitHub review process where possible

You may also want to:

- Speak to the author, and walk through the code together
- Run tests and linting checks locally (although these are done in GitHub anyway)
- Suggest changes to be made by the author
- Commit your own small changes if you have the time

:warning: Sometimes dependency changes within PRs can cause painfully long build times, which then impedes the review process. It is __strongly__ recommended to have a separate repository clone simply for reviewing PRs to ensure that you can continue doing your own work easily.

## Merging

### Merge Conditions

Conditions for PRs to be merged are dependent on the target branch.

#### Develop Branch

Before a PR can be merged into the develop branch, it must satisfy the following conditions:

- At least one approval review
- Zero unresolved comments
- Signed commits
- No merge conflicts with the target branch
- Status checks:
  - Format and linting tests pass on Rust and JS/TS files
  - Unit tests pass
  - If introducing a dependency then Snyk tests pass*

\* If your PR is based off of a forked repository, there is no way to test the Snyk continuous integration workflow as it needs an API key. Once your PR has been approved, you must create an intermediary branch _on the main repository_ titled `snyk/your-branch-here` so that the checks can be performed. Once _that_ passes, then your branch may finally be merged into `develop`.

#### Main Branch

Before a PR can be merged into the main branch, it must satisfy the following conditions:

- At least one approval review
- Zero unresolved comments
- Signed commits
- No merge conflicts with the target branch
- Status checks:
  - Format and linting tests pass on Rust and JS/TS files
  - Unit tests pass
  - Snyk tests pass

### Merge Method

To merge our PRs we are using the `Squash and merge` option in GitHub.
> When you select the Squash and merge option on a pull request on GitHub, the pull request's commits are squashed into a single commit. Instead of seeing all of a contributor's individual commits from a topic branch, the commits are combined into one commit and merged into the default branch. Pull requests with squashed commits are merged using the fast-forward option.
>
> To squash and merge pull requests, you must have write permissions in the repository, and the repository must allow squash merging.
