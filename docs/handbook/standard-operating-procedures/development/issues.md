---
icon: issue-opened
---

# Issues

## Purpose

This document details the standard operating procedure (SOP) for maintaining issues that have been raised on GitHub; allowing all team members to remain consistent when organising and maintaining the issues backlog.

## Scope

This standard operating procedure is only applicable to maintainers of this repository responsible for the issues backlog; and the issues backlog is that which is found on GitHub only.

## Responsibilities

All members of the core firefly team are responsible for managing issues. If an issue is assigned to you, then it is your responsibility. For those issues without an assignee, we aim to follow a rota to ensure that someone is always responsible for new issues created. You will find an up to date rota below.

### Schedule

* The bug management process is followed by 1 maintainer each week, rotating through all full time maintainers of the Firefly team (in alphabetical order), before cycling back to the begining.

## Processes

* [Bug Management](#bug-management)
* [Support Requests](#support-requests)

## External Processes

* [Security Vulnerability Process](https://github.com/iotaledger/firefly/wiki/SOP:-Security-Vulnerability)

## Bug Management

The bug management process is to be followed when a new issue is raised on GitHub that has the label `bug report` or an existing issue has been given the label `bug report`.

### Overview

```mermaid
  graph LR;
      Start(New bug report)
      Assess[[Assess]]
      Triage[[Triage]]
      Schedule[[Schedule]]
      End(End)
      
      Start-->Assess-->Triage-->Schedule-->End;
      Assess-->End;
      Triage-->End;
```

The above diagram details the high level overview of the bug management processes:

1. [Assess](#assessment) whether the issue issue is a valid.
2. [Triage](#triaging) the issue.
3. [Schedule](#scheduling) the issue to be fixed.

> **When managing issues please make sure you assign yourself to the issue on GitHub.**

### Assessment

The assessment process is usually followed as soon as an issue is labeled as `bug report` or when we have an existing backlog of bug reports that we need to groom. The assessment process is to ensure that we don't need to triage invalid issues. Please use the below flowchart as a guide to process:

```mermaid
  graph LR;
      Start(Start)
      isSR{Is <br /> support <br /> request?}
      isVR{Is <br /> valid <br /> report?}
      isDR{Is <br /> duplicate <br /> report?}
      SRP[[Support Request <br /> Process]]
      IRP[add invalid status label]
      NS(Next step)
      DRP[add duplicate status label]
      CI[Close issue]
      End(End)
      TP[[Triage Process]]
      
      Start-->isVR
      isVR--no-->isSR
      isVR--yes-->isDR
      isSR--no-->IRP-->CI
      isSR--yes-->SRP-->End
      isDR--no-->NS-.->TP
      isDR--yes-->DRP-->CI
      CI-->End
```

### Triaging

Once an issue has been assessed, we can then triage the issue to decide if we should fix the issue or if we just want to acknowledge the issue because we aren't planning to fix it. This should be done as soon as possible, by following the below process:

```mermaid
  graph LR;
      Start(Start)
      isSV{Is <br /> security <br /> vulnerability?}
      isBR{Is <br /> bug <br /> reproducable?}
      shouldFix{Should <br /> this be <br /> fixed?}
      SVP[[Security Vulnerability <br /> Process]]
      IB[Investigate bug]
      WF[add wontfix status label]
      CI[Close issue]
      End(End)
      NS(Next step)
      SP[[Schedule Process]]
      
      Start-->isSV
      isSV--no-->isBR
      isSV--yes-->SVP-->End
      isBR--no-->IB-->isBR
      isBR--yes-->shouldFix
      shouldFix--no-->WF-->CI
      shouldFix--yes-->NS-.->SP
      CI-->End
```

### Scheduling

If a bug has been triaged and it is agreed that we should fix the issue, then we need to prioritise the fix and schedule this fix. Again this should be done as soon as possible after triaging, and can be done by following the below process:

```mermaid
  graph LR;
      Start(Start)
      PI[Prioritise issue]
      CT[Create fix task]
      SF[Schedule task]
      AT[Allocate task]
      End(End)
      
      Start-->PI-->CT-->SF-->AT-->End   
```

## Support Requests

_TBD_
