---
icon: repo-forked
---

# Class Diagram

This document includes the class diagram of all activity types

```mermaid
classDiagram
    Subject -- Base Activity
    Activity Direction -- Base Activity
    Inclusion State -- Base Activity
    Async Data -- Base Activity
    Base Activity <|-- Transaction Activity
    Base Activity <|-- Nft Activity
    Base Activity <|-- Alias Activity
    Base Activity <|-- Foundry Activity
    Alias Activity -- Alias Type
    class Base Activity {
        <<Interface>>
        - id: string
        - id: string
        - outputId: string
        - transactionId: string
        - metadata: string
        - tag: string
        - time: Date
        - inclusionState: InclusionState
        - inputs: IUTXOInput[]
        - isHidden: boolean
        - containsValue: boolean
        - isAssetHidden: boolean
        - direction: ActivityDirection
        - isInternal: boolean
        - storageDeposit: number
        - giftedStorageDeposit: number
        - subject: Subject
        - isSelfTransaction: boolean
        - asyncData: AsyncData
    }
    class Transaction Activity {
        - type: ActivityType.Transaction
        - rawAmount: number
        - assetId: string
        - publicNote: string
        - isShimmerClaiming: boolean
    }
    class Nft Activity {
        - type: ActivityType.Nft
        - nftId: string
    }
    class Foundry Activity {
        - type: ActivityType.Foundry
        - rawAmount: number
        - assetId: string
    }
    class Alias Activity {
        - type: ActivityType.Alias
        - aliasId: string
        - aliasSubype: AliasSubtype
        - governorAddress: string
        - stateControllerAddress: string
    }
    class Subject {
        - type: "address" | "account"
        - address?: string
        - account?: IAccountState
    }
    class Activity Direction {
        <<Enum>>
        - Incoming
        - Outgoing
    }
    class Alias Type {
        <<Enum>>
        - Created
        - Other
    }
    class Async Data {
        - asyncStatus: ActivityAsyncStatus
        - timelockDate: Date
        - expirationDate: Date
        - isRejected: boolean
        - isClaiming: boolean
        - claimingTransactionId: string
        - claimedDate: Date
    }
    class Inclusion State {
        <<Enum>>
        - Pending
        - Confirmed
        - Conflicting
        - UnknownPruned
    }
```
