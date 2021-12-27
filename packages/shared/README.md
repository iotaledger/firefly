# Firefly - Shared

## `components`

Contains all of the common and reusable Svelte components
(e.g. popups, buttons, inputs).

## `lib`

Contains all of the business logic for the different features
in Firefly (e.g. handling migrations, transferring funds). Wrapper 
functions for the API (wallet.rs) or functions that use those are 
defined here.

## `locales`

Contains all of the data for translations in other languages 
(`en.json` (English) is used as a base for the translation).
Please do __NOT__ modify any files besides `en.json` as the others are synced from [Crowdin](https://crowdin.com/project/iota-firefly).

## `routes`

Contains Svelte source files that assemble smaller components together
with business logic to form the main views of Firefly.
