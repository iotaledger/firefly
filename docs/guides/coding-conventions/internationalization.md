---
icon: globe
---

# Internationalization

_Internationalization_ refers to designing a product in such a way that it can easily be localized (i.e. _localization_) into a target language. We currently use the [`svelte-i18n`](https://github.com/kaisermann/svelte-i18n) library to handle this functionality.

:warning: Localization __should__ be used only when dealing with user-facing text; if the user is not intended to see a message or error, then it __does NOT__ need to be localized.

## Usage

It is quite easy to use `svelte-i18n` once it has been configured and initialized. We simply import the `localize(...)` function, which allows us to create any localization as long as there is an entry for it in a corresponding `{language}.json` file.

If the provided path for the locale data __does NOT__ exist, the text will default to English. In the case that the English also __does NOT__ exist, an `undefined` value will be returned.

## International Components for Unicode

As is the norm for internationalization functionality, we adhere to the widely used [ICU](https://unicode-org.github.io/icu/userguide/icu/i18n.html) (International Components for Unicode) message format for creating better adapted localizations. With it, we can...

- __Create translations with no dynamic data__

    ```typescript
    // in en.json
    {
        "general": {
            "ateApple": "I ate an apple."
        }
    }

    // in code
    const text = localize('general.anApple') // "I ate an apple."
    ```

- __Create translations with simple dynamic data__

    ```typescript
    // in en.json
    {
        "general": {
            "ateDinnerWith": "I ate dinner with {person}."
        }
    }

    // in code
    const text = localize('general.ateDinnerWith', { values: { person: 'Wallet Jesus' }}) // "I ate dinner with Wallet Jesus."
    ```

- __Create translations with dynamic amounts__

    ```typescript
    // in en.json
    {
        "general": {
            "ateAppleCount": "I ate {numApples, plural, one {# apple} other {# apples}}."
        }
    }

    // in code
    const text = localize('general.ateAppleCount', { values: { numApples: 100 }}) // "I ate 100 apples."
    ```

- __Create translations with multiple conditions__

    ```typescript
    // in en.json
    {
        "general": {
            "friendOnline": "Hello, your friend {friend} is online. {gender, select, male {He} female {She} other {They}} have a new NFT profile pic!"
        }
    }

    // in code
    const text = localize(
        'general.friendsOnline',
        { values:  { friend: 'The Destroyer', gender: 'other' }}
    ) // "Hello, your friend The Destroyer is online. They have a new NFT profile pic!"
    ```

:warning: Punctuation __may or may NOT__ be used in a locale entry; if relevant, see similar texts to determine if you should use punctuation (e.g. setting description text __does NOT__ use punctuation).

:information_source: Although these four usages cover our needs well, there are a few more available functionalities specifically surrounding numbers, dates, and times (see [here](https://support.crowdin.com/icu-message-syntax/)).
