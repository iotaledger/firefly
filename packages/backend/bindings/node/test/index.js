const lib = require('../dist')
const assert = require('assert')
const fs = require('fs')

const generateRandomId = () => {
    return Math.random().toString()
};

const communicationIds = (actorId) => {
  return {
    actorId,
    messageId: generateRandomId()
  }
}

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
    fs.rmdirSync('./storage', {
      recursive: true,
      force: true
    })
    after(() => {
      try {
        fs.rmdirSync('./backup', {
          recursive: true,
          force: true
        })
      } catch {}
    })

    const actorId = Math.random().toString().replace('.', '')

    return new Promise(resolve => {
      const actor = lib.init(actorId)
      let index = 0
      lib.onMessage(message => {
        console.log(message, index)
        switch (index++) {
          case 0: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'StrongholdPasswordSet',
              action: 'SetStrongholdPassword'
            })
            lib.api.storeMnemonic()(communicationIds(actorId))
            break
          }
          case 1: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'StoredMnemonic',
              action: 'StoreMnemonic'
            })
            lib.api.createAccount({
              clientOptions: {
                node: 'https://nodes.devnet.iota.org:443'
              }
            })(communicationIds(actorId))
            break
          }
          case 2: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'CreatedAccount',
              payload: message.payload,
              action: 'CreateAccount'
            })
            if (fs.existsSync('./backup')) {
              fs.rmdirSync('./backup', {
                recursive: true,
                force: true
              })
            }
            fs.mkdirSync('./backup')
            lib.api.backup('./backup')(communicationIds(actorId))
            break
          }
          case 3: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'BackupSuccessful',
              action: 'Backup'
            })
            lib.api.setStrongholdPassword('password')(communicationIds(actorId)) // since we removed the snapshot, reload stronghold
            break
          }
          case 4: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'StrongholdPasswordSet',
              action: 'SetStrongholdPassword'
            })
            // clear the current storage
            lib.api.removeAccount(0)(communicationIds(actorId))
            break
          }
          case 5: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'RemovedAccount',
              action: 'RemoveAccount',
              payload: 0
            })
            lib.api.restoreBackup('./backup/' + fs.readdirSync('./backup')[0], 'password')(communicationIds(actorId))
            break
          }
          case 6: {
            assert.deepStrictEqual(message, {
              id: message.id,
              type: 'BackupRestored',
              action: 'RestoreBackup'
            })
            actor.destroy()
            resolve()
            break
          }
        }
      })
  
      lib.api.setStrongholdPassword('password')(communicationIds(actorId))
    })
  })
})
