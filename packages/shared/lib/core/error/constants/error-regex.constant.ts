import { ClientError } from '../enums'

export const CLIENT_ERROR_REGEXES = {
    [ClientError.InvalidStrongholdPassword]: /`invalid stronghold password`/,
    [ClientError.NoSyncedNode]: /`No synced node available`/,
    [ClientError.TimeNotSynced]: /`Local time \d* doesn't match the time of the latest milestone timestamp: \d*`/,
}
