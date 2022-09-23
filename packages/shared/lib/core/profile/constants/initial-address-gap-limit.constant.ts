import { ProfileType } from '../enums'

export const INITIAL_ADDRESS_GAP_LIMIT: Readonly<{ [key in ProfileType]: number }> = {
    [ProfileType.Software]: 1,
    [ProfileType.Ledger]: 1,
}
