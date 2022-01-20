import extension from '../browser'
import type {Tab,Error} from '../../shared/types'

const windows:any = (extension as any).windows
const tabs:any = (extension as any).tabs

// more utils here:
// https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/platforms/extension.js

interface Window {
  id: any
  left: number
  top: number
  state: string
  width: number
}
export function openWindow(options):Promise<Window> {
  return new Promise((resolve, reject) => {
    windows.create(options, (newWindow) => {
      const error = checkForError()
      if (error) return reject(error)
      return resolve(newWindow)
    })
  })
}

export function focusWindow(windowId) {
  return new Promise((resolve, reject) => {
    windows.update(windowId, { focused: true }, () => {
      const error = checkForError()
      if (error) return reject(error)
      return resolve(true)
    })
  })
}

export function updateWindowPosition(windowId, left, top) {
  return new Promise((resolve, reject) => {
    windows.update(windowId, { left, top }, () => {
      const error = checkForError()
      if (error) return reject(error)
      return resolve(true)
    })
  })
}

export function getLastFocusedWindow():Promise<Window> {
  return new Promise((resolve, reject) => {
    windows.getLastFocused((windowObject) => {
      const error = checkForError()
      if (error) return reject(error)
      return resolve(windowObject)
    })
  })
}

export function getAllWindows() {
  return new Promise((resolve, reject) => {
    windows.getAll((windows) => {
      const error = checkForError()
      if (error) return reject(error)
      return resolve(windows)
    })
  })
}

export function closeCurrentWindow() {
  return windows.getCurrent((windowDetails) => {
    return windows.remove(windowDetails.id)
  })
}

export function getVersion() {
  return extension.runtime.getManifest().version
}

export function currentTab():Promise<Tab|Error> {
  return new Promise((resolve, reject) => {
    tabs.query({ active: true }, function (tabs) {
      resolve(tabs[0])
    });
  })
}

export function currentActiveWindowTab():Promise<Tab|Error> {
  return new Promise((resolve, reject) => {
    tabs.query({ currentWindow: true, active: true }, function (tabs) {
      resolve(tabs[0])
    });
  })
}

export function currentTabs():Promise<Tab|Error> {
  return new Promise((resolve, reject) => {
    tabs.query({ active: true }, function (tabs) {
      resolve(tabs)
    });
  })
}

export function tabsByURL(urls: string[]): Promise<Tab[]|Error> {
  return new Promise((resolve, reject) => {
    if(!urls.length) {
      resolve([])
      return
    }
    tabs.query({ url: urls }, function (tabs) {
      resolve(tabs)
    });
  })
}

export function closeTab(tabId) {
  return new Promise((resolve, reject) => {
    tabs.remove(tabId, () => {
      const err = checkForError()
      if (err) reject(err)
      else resolve(true)
    })
  })
}

export const PLATFORM_BRAVE = 'Brave'
export const PLATFORM_CHROME = 'Chrome'
export const PLATFORM_EDGE = 'Edge'
export const PLATFORM_FIREFOX = 'Firefox'
export const PLATFORM_OPERA = 'Opera'

export const getPlatform = (_) => {
  const ua = window.navigator.userAgent
  if (ua.search('Firefox') === -1) {
    if (window && (window as any).chrome && (window as any).chrome.ipcRenderer) {
      return PLATFORM_BRAVE
    }
    if (ua.search('Edge') !== -1) {
      return PLATFORM_EDGE
    }
    if (ua.search('OPR') !== -1) {
      return PLATFORM_OPERA
    }
    return PLATFORM_CHROME
  }
  return PLATFORM_FIREFOX
}

export function checkForError() {
  const { lastError } = extension.runtime
  if (!lastError) {
    return undefined
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message)
}
