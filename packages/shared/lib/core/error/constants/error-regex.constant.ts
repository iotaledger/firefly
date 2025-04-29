import { ClientError, IotaClientError } from '../enums'

export const CLIENT_ERROR_REGEXES = {
    [ClientError.InvalidStrongholdPassword]: /`invalid stronghold password`/,
    [ClientError.StrongholdMigration]:
        /stronghold migration error: failed to decrypt snapshot: incorrect password or corrupt data/,
    [ClientError.MigrationRequired]: /`unsupported snapshot version, expected \d*, found \d*, migration required`/,
    [ClientError.NoSyncedNode]: /`No synced node available`/,
    [ClientError.InsufficientAmount]: /`insufficient amount: found \d*, required \d*`/,
    [ClientError.TimeNotSynced]: /`local time \d* doesn't match the time of the latest milestone timestamp: \d*`/,
    [IotaClientError.NoInputs]: /no inputs found/,
    [IotaClientError.NotEnoughBalance]:
        /the wallet account doesn't have enough balance. It only has \d*, required is \d*/,
}
