---
icon: globe
---

# Crowdin

We use (Crowdin)[https://crowdin.com/] for localization management.

## Process

- Merge English translations and trigger “Crowdin” workflow to push strings to translators. There are different translations for `develop` and `main` branches.

- Ping translators in discord (`#firefly-translations`). Example:

    ```
    @everyone We have added the Stardust translations to Crowdin. There are 35 new strings. When you find some time, we'd be very thankful if you can work on these.

    You can use the Firefly Desktop Stardust Beta to see where exactly the strings are used: https://github.com/iotaledger/firefly/releases/tag/desktop-2.0.0-beta-1.0.1

    🧙‍♂️
    ```