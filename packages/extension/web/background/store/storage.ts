// https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/lib/local-store.js
import extension from "../../shared/browser";

const storage = (extension as any).storage

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function checkForError() {
  const lastError = extension.runtime.lastError
  if (!lastError) return
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) return lastError
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message)
}

class ExtensionStore {

  private isSupported
  constructor() {
    this.isSupported = Boolean(storage.local)
  }

  async get() {
    if (!this.isSupported) return undefined
    const result = await this._get()
    return result
  }

  async set(state:{[k:string]:any}) {
    return this._set(state)
  }

  async clear() {
    return this._clear()
  }

  private _clear() {
    const local = storage.local
    return new Promise((resolve, reject) => {
      local.clear(() => {
        const err = checkForError()
        if (err) reject(err)
        else resolve(true)
      })
    })
  }

  private _get() {
    const local = storage.local
    return new Promise((resolve, reject) => {
      local.get(null, (/** @type {any} */ result) => {
        const err = checkForError()
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  private _set(obj) {
    const local = storage.local
    return new Promise((resolve, reject) => {
      local.set(obj, () => {
        const err = checkForError()
        if (err) reject(err)
        else resolve(true)
      })
    })
  }
}

const stor = new ExtensionStore()

export default stor