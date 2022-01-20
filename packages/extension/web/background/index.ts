import extension from "../shared/browser";
import * as actions from './actions'
import * as confirm_actions from './confirmActions'
import type { FullMsg } from '../shared/types'
import { acceptList } from './store'
import * as store from './store'

const ID = extension.runtime.id
const ORIGIN = 'chrome-extension://'+ID

const runtime = extension.runtime
runtime.onMessage.addListener(runAction)

async function runAction(msg: FullMsg, sender) {
  // console.log('==>', msg) //sender)
  // replace the "origin" with "from" (the pre-confirm origin)
  if(msg.origin===ORIGIN && sender.origin===ORIGIN) { // from extension
    if (actions[msg.cmd]) {
      const m = { ...msg, origin: msg.from || msg.origin }
      console.log('=>', msg)
      actions[msg.cmd](m)
    }
  } else { // from inpage provider
    const accepted = await acceptList(msg.origin)
    if (accepted && confirm_actions[msg.cmd]) {
      confirm_actions[msg.cmd](msg)
    }
  }
}

/*
TESTING
*/
/*
store.clearAllOrigins()

store.setProfile({
  name: 'Evan',
  id: '***',
  accounts:[
    {
      id: 'accountID1',
      alias: 'Main Account',
      rawIotaBalance: 10000,
      balance: '10Mi'
    },
    {
      id: 'accountID2',
      alias: 'Spending',
      rawIotaBalance: 20000,
      balance: '20Mi'
    }
  ]
})
*/