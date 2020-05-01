# Extension System: Request For Proposal (RFP)
[RFP]: #RFP

## Frontmatter
[frontmatter]: #frontmatter
```yaml
RFP: application/runtime_extensions-RFP-0000
Maintainer: Lucas Nogiuera
updated: 2020-APR-29
```

## Summary
[summary]: #summary

## Requirements
[requirements]: #requirements

- It should be simple for a dev to add a new extension
- Extensions should match the UI/styling of the wallet
- It should be simple for a user to install a new extension
- An extension should only have access to a strict set of app functions
- A user should confirm any sensitive requests by the extension (e.g. send transaction)
- The extension system should allow sufficient customisability for interesting use cases e.g. buying IOTA in the wallet

## Considerations
[considerations]: #considerations

Things to think about:
- How to add new extensions (on desktop, and with mobile app stores)
  - Downloading the plugin’s JSON file and storing it in the app storage
- How to limit API access for extensions
  - See topic 1.
- How to ensure extensions match the wallet’s UI
  - See topic Pros. 1
- How to audit new extensions
- How to give developers flexibility for the use cases they build
  - See topic 4
- How to grant extensions access to the Rust API in Capacitor and in Electron

## Technical Proposal
[technical-proposal]: #technical-proposal

1. The API exposed to extensions are wrappers to the “real” API implementation, so it can force some API calls to require user confirmation

```
[img]
```

2. Allowing an extension to run as a sandboxed web application can lead to security issues like an extension tricking the user to do something harmful to their wallet, e.g. with iframes the plugin could change the app’s URL to a website with similar UI or display content to trick the user

3. Extensions are defined as JSON files, so we can control what kind of JS features the 3rd party has access to:

4. We could allow the schema to reference 3rd party components, if they’re audited

### Pros
1. We ensure the plugin’s UI matches the wallet’s design system, by forcing the JSON schema to use our components
2. We ensure the security of the plugin’s execution by not allowing it to run JS code

### Cons
1. We lose the flexibility of running any JS operation

Example JSON:

```
MISSING TEXT
```

4. We could use an HTML to JSON converter to simplify the process of writing a plugin, so the 3rd party developer doesn’t have to worry about writing JSON.
Possibly leverage: https://github.com/jsdom/jsdom

### Reference-level explanation
[reference-level-explanation]: #reference-level-explanation

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more fully how the detailed proposal makes those examples work.

### Drawbacks
[drawbacks]: #drawbacks

Why should we *not* do this?

## Rationale and alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not choosing them?
- What is the impact of not doing this?


## Research
[research]: #research

https://gist.github.com/pfrazee/8949363
https://github.com/google/caja
https://www.ostraining.com/blog/webdesign/against-using-iframes/
