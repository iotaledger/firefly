import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { getAllEvmAddresses } from '../utils'
import { buildApprovedNamespaces } from '@walletconnect/utils';

export function onSessionProposal(web3wallet: any, sessionProposal: any): void {
    const { id, params } = sessionProposal

    const chains = ['eip155:1',]

    const accounts = getAllEvmAddresses(chains)
    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
            eip155: {
                chains,
                methods: SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts,
            },
        },
    })

    web3wallet.approveSession({ id, namespaces: approvedNamespaces })
}
