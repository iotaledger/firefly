# Wallet Application Overview: Request For Proposals (RFP)
[RFP]: #RFP

## Frontmatter
[frontmatter]: #frontmatter
```yaml
title: Project
stub: project
document: RFP
version: 0000
maintainer: Firstname Lastname <email@address.tld>
contributors: [Firstname Lastname <email@address.tld>]
sponsors: [Firstname Lastname <email@address.tld>]
licenses: ["License X", "License Y"]
updated: YYYY-MMM-DD
```
## Summary
[summary]: #summary

The application is the base layer of the WALLET. There are a number of components are the basic building blocks of the Application which manage
internal state and interact with device APIs.

## Requirements
[requirements]: #requirements

## Technical Proposal
[technical-proposal]: #technical-proposal

```
Application
  Actor Model
    Supervisor
    Actors
    Messages
  Runtime Extensions
  Notifications
    System-based (Push)
      Transaction received
      User Resolvable Error messages
  Networking
    Inter-device communication
      Transport:
      TCP
        Flow:
          Input
          Output
    Intra-device communication
      Transport:
        Deeplinks
      Flow:
        Input
        Output
  Insecure Storage
```

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
