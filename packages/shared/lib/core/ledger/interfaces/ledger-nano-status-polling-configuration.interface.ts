import { SecretManager } from '@iota/sdk'
import { Readable } from 'svelte/store'

export interface ILedgerNanoStatusPollingConfiguration {
    pollInterval?: number
    secretManager?: Readable<SecretManager>
}
