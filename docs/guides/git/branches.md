---
icon: git-branch
---

# Branches

Branch names **must** follow a certain structure, which is `branch-prefix/branch-name`. The `branch-prefix` corresponds to one of the conventional commit types defined above and the branch name is a concise but informative name representing your changes, e.g. `feat/your-cool-feature` and `chore/new-doc`. PR titles are based off of the branch name, so for the examples just used they **should be** "feat: Your cool feature" and "chore: New doc".

## Protected Branches

The Firefly team develops code and pushes PRs on certain protected branches. The following three branches are protected:

-   `main`: contains the code for Firefly Desktop v1.
-   `develop`: contains the code for Firefly Shimmer Desktop
