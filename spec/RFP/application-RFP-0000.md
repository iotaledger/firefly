# Application Overview: Request For Proposal (RFP)

# Frontmatter
[frontmatter]: #frontmatter
```yaml
RFP: application
Maintainer: Daniel Thompson-Yvetot
updated: 2020-APR-29
```

# Introduction
[introduction]: #introduction

The application is the base layer of the WALLET. There are a number of components are the basic building blocks of the Application which manage
internal state and interact with device APIs.

# Requirements
[requirements]: #requirements

# Considerations
[considerations]: #considerations

# Technical Proposal
[technical-proposal]: #technical-proposal

```
Application
  Actor Model
    Supervisor
    Actors
    Messages
  Runtime Plugins
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

# Research
[research]: #research




