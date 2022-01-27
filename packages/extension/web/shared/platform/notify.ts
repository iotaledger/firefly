import * as platform from './index';
import type {FullMsg} from '../types'
import {makeParams} from '../utils'
// confirmation dialog

const CONFIRM_HEIGHT = 377
const CONFIRM_WIDTH = 266
const POPUP_TYPE = 'popup'

let _notifyId;

const pathToConfirm = 'confirm/public/index.html'

async function _getNotify() {
  const windows = await platform.getAllWindows()
  return _getNotifyIn(windows)
}

async function _getNotifyIn(windows) {
  return windows
    ? windows.find((win) => {
        return win && win.type === POPUP_TYPE && win.id === _notifyId
      })
    : null
}

export async function closeNotify() {
  platform.closeCurrentWindow()
}

export async function showNotify(msg: FullMsg) {
  const notify = await _getNotify()

  // Bring focus to chrome notify
  if (notify) {
    // bring focus to existing chrome notify
    await platform.focusWindow(notify.id)
  } else {
    let left = 0
    let top = 0
    try {
      const lastFocused = await platform.getLastFocusedWindow()
      // Position window in top right corner of lastFocused window.
      top = lastFocused.top
      left = lastFocused.left + (lastFocused.width - CONFIRM_WIDTH)
    } catch (_) {
      // The following properties are more than likely 0, due to being
      // opened from the background chrome process for the extension that
      // has no physical dimensions
      const { screenX, screenY, outerWidth } = window
      top = Math.max(screenY, 0)
      left = Math.max(screenX + (outerWidth - CONFIRM_WIDTH), 0)
    }

    const notifyWindow = await platform.openWindow({
      url: pathToConfirm + '?' + makeParams(msg),
      type: POPUP_TYPE,
      width: CONFIRM_WIDTH,
      height: CONFIRM_HEIGHT,
      left,
      top,
    })

    // Firefox currently ignores left/top for create, but it works for update
    if (notifyWindow.left !== left && notifyWindow.state !== 'fullscreen') {
      await platform.updateWindowPosition(notifyWindow.id, left, top)
    }
    _notifyId = notifyWindow.id
  }
}
