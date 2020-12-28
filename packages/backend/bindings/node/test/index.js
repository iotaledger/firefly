const lib = require('../dist')
const assert = require('assert')
const fs = require('fs')

const generateRandomId = () => {
    return Math.random().toString()
};

lib.initLogger({
  color_enabled: false,
  outputs: [{
    name: 'stdout',
    target_level: 'trace',
    target_filters: ['wallet']
  }]
})

describe('binding', () => {
  /* it('gets an event', () => {
    lib.init()
    lib.onMessage(console.log)
    lib.api.listenToErrorEvents()(generateRandomId())
  }) */
  it('creates an account, backup and restore it', () => {
    fs.rmSync('./example-database', {
      recursive: true,
      force: true
    })
    after(() => {
      try {
        fs.rmSync('./backup', {
          recursive: true,
          force: true
        })
      } catch {}
    })

    return new Promise(resolve => {
      lib.init()
      let index = 0
      lib.onMessage(message => {
        console.log(message)
        switch (index++) {
          case 0: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'StrongholdPasswordSet',
              action: 'SetStrongholdPassword'
            })
            lib.api.createAccount({
              clientOptions: {
                node: 'https://nodes.devnet.iota.org:443'
              }
            })(generateRandomId())
            break
          }
          case 1: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'CreatedAccount',
              payload: message.payload,
              action: 'CreateAccount'
            })
            lib.api.backup('./backup')(generateRandomId())
            break
          }
          case 2: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'BackupSuccessful',
              action: 'Backup'
            })
            fs.unlinkSync('./example-database/wallet.stronghold')
            lib.api.setStrongholdPassword('password')(generateRandomId()) // since we removed the snapshot, reload stronghold
            break
          }
          case 3: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'StrongholdPasswordSet'
            })
            lib.api.restoreBackup('./backup', 'password')(generateRandomId())
            break
          }
          case 4: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'BackupRestored'
            })
            resolve()
            break
          }
        }
      })
      lib.api.setStrongholdPassword('password')(generateRandomId())
      })
    })
})
