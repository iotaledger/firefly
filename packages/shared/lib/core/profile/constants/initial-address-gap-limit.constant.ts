import { ProfileType } from '../enums'

export const INITIAL_ADDRESS_GAP_LIMIT: Readonly<{ [key in ProfileType]: number }> = {
    [ProfileType.Software]: 0,
    [ProfileType.Ledger]: 0,
}
