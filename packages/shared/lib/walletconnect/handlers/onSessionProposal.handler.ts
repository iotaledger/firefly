import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { getAllEvmAddresses } from '../utils'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { Web3Wallet } from '@walletconnect/web3wallet/dist/types/client'

export function onSessionProposal(web3wallet: Web3Wallet, sessionProposal: Web3WalletTypes.SessionProposal): void {
    const { id, params } = sessionProposal

    const chains = ['eip155:1']

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
