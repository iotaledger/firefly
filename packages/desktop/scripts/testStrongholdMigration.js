const WalletApi = require('firefly-actor-system-nodejs-bindings')

WalletApi.migrateStrongholdSnapshotV2ToV3(
    '/home/maxwellmattryan/dev/iota/backups/old-01.stronghold',
    'raise-pencil-stone',
    '/home/maxwellmattryan/dev/iota/backups/MIGRATED.stronghold',
    'raise-pencil-stone'
)
