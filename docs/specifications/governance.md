---
icon: log
---

# Governance

Governance refers to the feature allowing users to vote on important community-wide decisions along with other operations and functionality to help achieve a smooth user experience. 

`packages/desktop/features/governance.features.ts` contains the feature flag that allows you to disable the tab if necessary.

## Definitions

- **Event** - a participation event where a user can vote (or stake) his or her funds; this always assumes a _voting event_ unless specified otherwise
- **Event phase** - an event can be in four different phases:
  - `upcoming` - corresponds to "Announcement"
  - `commencing` - corresponds to "Voting open"
  - `holding` - corresponds to "Counting"
  - `ended` - corresponds to "Closed"
- **Governance** - rules and processes to make decisions concerning permissionless applications and platforms
- **Participation** - interacting with or taking part in an event, either by voting or staking funds
- **Proposal** - synonymous with voting event, which is an event that contains one or more questions that users can vote on
- **Vote** - participating in a voting event, initially by selecting answers (aka votes) for each question on the proposal's ballot then broadcasting a transaction with appropriately structured metadata (so that it can be tracked by the node(s))
- **Voting output** - a designated output to be used for all voting operations (e.g. increasing or decreasing voting power and voting or unvoting for an event) 
- **Voting power** - the amount of votes a user can cast for a proposal, which is based on how much IOTA or SMR he or she has; this **MAY** or **MAY NOT** be the same as a user's total balance, it depends on how much they have manually designated as their voting power

## Adding a Proposal

A user first needs to add a proposal to his or her dashboard to be able to vote on it.
This can happen in multiple ways:

- Firefly automatically registering the proposals that are published on the node(s) specified in the client options
- The user manually entering a proposal (aka event) ID and a node URL on which the event was published
- The user following a deep link containing a proposal (aka event) ID and a node URL on which the event was published

Firefly regularly polls the given node(s) to update the states of the added proposals, which includes the current vote results. 

Users may also remove proposals from their account(s), but only if they are **NOT** currently voting for the proposal.

## Voting on a Proposal

### Managing Voting Power

Users must have a non-zero voting power to be able to vote for a proposal.
They click the "Manage voting power" button from the Governance dashboard to increase or decrease their voting power.

A voting output is equivalent to a basic output that is tagged with the `PARTICIPATE` keyword.
They are designated for voting only and will **NOT** be used in non-Governance transactions.
A user can choose to designate any non-zero amount less than or equal to their available balance to become his or her voting power.

Voting outputs are inconsumable for all transactions, unless the user is...

- Increasing or decreasing voting power
- Voting or unvoting for a proposal

By consequence, this means that voting power is **NOT** considered a part of a user's available balance.

### Casting a Vote

In order to cast a vote for a proposal, there are two steps:

1. Select at least one answer for a question on the proposal's ballot
2. Broadcast a transaction containing the vote(s) as both a tagged data payload (what is tracked by the nodes) and output metadata

If the user is voting for the first time, the data payload and output metadata will be added alongside the existing `PARTICIPATE` tag, otherwise the answers will be appended to the existing payload and metadata.
As a result, **users can vote for multiple proposals with the same amount of voting power.**

Unvoting for a proposal simply removes the relevant data from the data payload and output metadata. 

## Resources

- [RFC-06 (Hornet Participation Plugin)](https://github.com/iota-community/treasury/blob/main/specifications/hornet-participation-plugin.md)
- [TIP-0020 (Transaction Payload with TIP-0018 Output Types)](https://github.com/iotaledger/tips/blob/main/tips/TIP-0020/tip-0020.md)
- [TIP-0023 (Tagged Data Payload)](https://github.com/iotaledger/tips/blob/main/tips/TIP-0023/tip-0023.md)
