---
icon: file
---

# Documentation

## Purpose

This document details the standard operating procedure (SOP) for maintaining and modifying Firefly documentation (handbook *and* the GitHub wiki).

## Scope

This SOP is applicable to contributors to the Firefly repository, mainly the core Firefly development team.

## Responsibilities

All members of the Firefly team are responsible for maintaining documentation, specifically in ensuring its accuracy and relevancy, as we all use this resource and benefit from it being of the highest possible quality.

## Processes

- [Handbook](#handbook)
- [GitHub Wiki](#github-wiki)

## Handbook

### Releasing a New Firefly Version

Simply change the value for `label` under `branding` in [Retype config file](https://github.com/iotaledger/firefly/blob/develop/docs/retype.yml#L8) to the appropriate version.

### Updating the Handbook

To make changes to the documentation within this handbook, begin the process by creating a GitHub task specifically for your desired changes. Please use the ["Continuously improve documentation"](https://github.com/iotaledger/firefly/milestone/6) milestone when creating the task.

### Updating the Code

When making changes to the code, be sure to check whether the comments if the functions, variables, etc. that you're dealing with are up-to-date and accurate.
If writing new code that is exported and intended to be used elsewhere, make sure that it is appropriately commented (see the [coding conventions on comments](../../guides/coding-conventions/comments.md)).

Every new folder and page must have an `icon: <icon>` entry in the top of its corresponding file (see [Octicons](https://primer.style/octicons/)).
Lastly, every new folder must have some sort of text describing what its purpose is and what you'll find when looking in it.

## GitHub Wiki

As it is easier to make changes to the wiki, please feel free to do so as you see fit, while taking care to make sure that any documentation changed there that also exists here **must** be consistent (with this handbook being the source of truth).
