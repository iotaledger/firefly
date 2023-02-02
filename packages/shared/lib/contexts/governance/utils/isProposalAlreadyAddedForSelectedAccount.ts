import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '../stores'

export function isProposalAlreadyAddedForSelectedAccount(proposalId: string): boolean {
    return !!get(registeredProposalsForSelectedAccount)?.[proposalId]
}
