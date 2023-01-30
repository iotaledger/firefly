---
icon: log
---

# Governance

Governance, as it pertains to Firefly, refers to the feature allowing users to vote on important community-wide decisions along with
other operations and functionality to help achieve a smooth user experience. 

Like other features, there is a corresponding feature flag that will allow you to disable this tab if necessary.

## Definitions

- **Event** - a participation event where a user can vote (or stake) his or her funds; this always assumes a _voting event_ unless specified otherwise
- **Event phase** - the 
- **Governance** - rules and processes that are used for making decisions concerning permission-less applications and platforms
- **Participation** - interacting with or taking part in an event, either by voting or staking funds
- **Proposal** - synonymous with voting event, which is an event that contains one or more questions to be voted on by users
- **Register** - to add a proposal to an account in Firefly
- **Vote** - participating in a voting event, initially by selecting answers (aka votes) for each question on the proposal's ballot then broadcasting a transaction with appropriately structured metadata (so that it can be tracked by the node(s))
- **Voting output** - a designated output to be used for all voting operations (e.g. increasing or decreasing voting power and voting or unvoting for an event) 
- **Voting power** - the amount of votes a user can cast for a proposal, which is based off of how much IOTA or SMR he or she has; this **MAY** or **MAY NOT** be the same as a user's total balance, it depends on how much they have manually designated as their voting power

## Registering a Proposal

To be able to vote on a proposal, a user first needs to register it. This can happen in multiple ways:

- Automatically registering the proposals that are tracked by the client options node(s)
- Manually entering a proposal (aka event) ID and a URL of a node that is tracking it
- Following a deep link containing a proposal (aka event) ID and a URL of a node that is tracking it

Once registered, Firefly will regularly poll the given node(s) to update the states of the proposals, which includes the current vote results. 

Users may also "de-register" or remove proposals from their account(s), but only if they are **NOT** currently voting for the proposal.

## Voting on a Proposal

### Managing Voting Power

Users must have a non-zero voting power to be able to vote for a proposal. To do this, they simply click the "Manage voting power" button from the Governance dashboard.

Funds are designated for voting by creating a voting output, i.e. a basic output that is tagged with the `PARTICIPATE` keyword. A user can choose to designate any non-zero amount less than or equal to their available balance to become his or her voting power.

Voting outputs are inconsumable for all transactions, unless the user is...

- Increasing or decreasing voting power
- Voting or unvoting for a proposal

By consequence, this means that voting power is **NOT** considered a part of a user's available balance.

### Casting a Vote

In order to cast a vote for a proposal, there are two steps:

1. Select an answer for every question on the proposal's ballot
2. Broadcast a transaction containing those votes as both a tagged data payload (what is tracked by the nodes) and output metadata

If this is the first proposal a user is voting on, the data payload and output metadata will be added alongside the existing `PARTICIPATE` tag, otherwise
the answers will be appended to the existing payload and metadata. As a result, **users can vote for multiple proposals with the same amount of voting power.**

Unvoting for a proposal is simply removing the relevant data from the data payload and output metadata. 

## Resources

- [RFC-06 (Hornet Participation Plugin)](https://github.com/iota-community/treasury/blob/main/specifications/hornet-participation-plugin.md)
- [TIP-0020 (Transaction Payload with TIP-0018 Output Types)](https://github.com/iotaledger/tips/blob/main/tips/TIP-0020/tip-0020.md)
- [TIP-0023 (Tagged Data Payload)](https://github.com/iotaledger/tips/blob/main/tips/TIP-0023/tip-0023.md)
