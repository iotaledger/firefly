import { ProfileType } from '../enums'

export const INITIAL_ACCOUNT_GAP_LIMIT: Readonly<{ [key in ProfileType]: number }> = {
    [ProfileType.Software]: 10,
    [ProfileType.Ledger]: 1,
}
