# Contribute to wallet

This document describes how to contribute to wallet.

We encourage everyone with knowledge of IOTA technology to contribute.

Thanks! :heart:

<details>
<summary>Do you have a question :question:</summary>
<br>

If you have a general or technical question, you can use one of the following resources instead of submitting an issue:

- [**Developer documentation:**](https://docs.iota.org/) For official information about developing with IOTA technology
- [**Discord:**](https://discord.iota.org/) For real-time chats with the developers and community members
- [**IOTA cafe:**](https://iota.cafe/) For technical discussions with the Research and Development Department at the IOTA Foundation
- [**StackExchange:**](https://iota.stackexchange.com/) For technical and troubleshooting questions
</details>

<br>

<details>
<summary>Ways to contribute :mag:</summary>
<br>

To contribute to wallet on GitHub, you can:

- Report a bug
- Suggest a new feature
- Build a new feature
- Join the wallet Initiative
</details>

<br>

<details>
<summary>Report a bug :bug:</summary>
<br>

This section guides you through reporting a bug. Following these guidelines helps maintainers and the community understand the bug, reproduce the behavior, and find related bugs.

### Before reporting a bug

Please check the following list:

- **Do not open a GitHub issue for [security vulnerabilities](.github/SECURITY.MD)**, instead, please contact us at [security@iota.org](mailto:security@iota.org).

- **Ensure the bug was not already reported** by searching on GitHub under [**Issues**](https://github.com/iotaledger/wallet/issues). If the bug has already been reported **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

**Note:** If you find a **Closed** issue that seems similar to what you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Submitting A Bug Report

To report a bug, [open a new issue](https://github.com/iotaledger/wallet/issues/new), and be sure to include as many details as possible, using the template.

**Note:** Minor changes such as fixing a typo can but do not need an open issue.

If you also want to fix the bug, submit a [pull request](#pull-requests) and reference the issue.
</details>

<br>

<details>
<summary>Suggest a new feature :bulb:</summary>
<br>

This section guides you through suggesting a new feature. Following these guidelines helps maintainers and the community collaborate to find the best possible way forward with your suggestion.

### Before suggesting a new feature

**Ensure the feature has not already been suggested** by searching on GitHub under [**Issues**](https://github.com/iotaledger/wallet/issues).

### Suggesting a new feature

To suggest a new feature, talk to the IOTA community and IOTA Foundation members in the #wallet-discussion channel on [Discord](https://discord.iota.org/).

Or, you can submit an official [Request for Comments (RFC)](https://github.com/iotaledger/wallet-rfcs/).

</details>

<br>

<details>
<summary>Build a new feature :hammer:</summary>
<br>

This section guides you through building a new feature. Following these guidelines helps give your feature the best chance of being approved and merged.

### Before building a new feature

Make sure to discuss the feature in the #wallet-discussion channel on [Discord](https://discord.iota.org/).

Otherwise, your feature may not be approved at all.

### Building a new feature

To build a new feature, check out a new branch based on the `master` branch, and be sure to document any public-facing APIs.
</details>

<br>

<details>
<summary>Join the wallet Initiative :deciduous_tree:</summary>
<br>

The [wallet Initiative](https://github.com/iota-community/wallet) is a collaborative effort to improve the wallet developer experience by focussing on the following goals:

- Quality Assurance and Quality Control
- Documentation
- Benchmarks
- RFCs
- Node usability
- Improvements to modules and libraries

## How much time is involved

You can invest as much or as little time as you want into the initiative.

## What's in it for you

In return for your time, not only do you get to be a part of the future of IOTA technology, you will also be given a badge on Discord to show others that you're a valuable member of the IOTA community.

## How to join

If you're interested in joining, chat to us in the #experience channel on [Discord](https://discord.iota.org/).

</details>

<br>

<details>
<summary>Pull requests :mega:</summary>
<br>

This section guides you through submitting a pull request (PR). Following these guidelines helps give your PR the best chance of being approved and merged.

### Commit message guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), so commit messages are consistent.

Commit messages and branch names should follow a consistent structure (we use [Conventional Commits](https://guides.github.com/introduction/flow/index.html)).

1. `fix:` a commit of the type fix patches a bug in the codebase.
2. `feat:` a commit of the type feat introduces a new feature to the codebase.
3. types other than fix: and feat: are allowed, `chore:`, `ci:`, `style:`, `refactor:`, `perf:`, `test:`, and others.
4. branch names should follow a similar pattern e.g. `feat/new-feature`, `chore/update-docs` etc.

### Submitting a pull request

We use [Github Flow](https://guides.github.com/introduction/flow/index.html), so all code changes happen through pull requests. 

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). When creating a pull request, please follow these steps:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints.
5. Issue your pull request
    * All code should follow the [code styleguide](/docs/dev/styleguide.md).
    * A pull request should have exactly one concern (i.e. one feature or one bug). A PR that addresses more than one concern should be split into multiple PRs.

If all [status checks](https://help.github.com/articles/about-status-checks/) pass, and the maintainer approves the PR, it will be merged.

**Note:** Reviewers may ask you to complete additional work, tests, or other changes before your pull request can be approved and merged.
</details>

<br>

<details>
<summary>Code of Conduct :clipboard:</summary>
<br>

This project and everyone participating in it is governed by the [IOTA Code of Conduct](.github/CODE_OF_CONDUCT.md).