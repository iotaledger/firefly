import { MenuItemConstructorOptions, shell } from 'electron'
import { menuState } from '../'

export function createExternalUrlMenuItem(
    stringsKey: keyof typeof menuState['strings'],
    url: string
): MenuItemConstructorOptions {
    return {
        label: menuState.strings[stringsKey],
        click: () => shell.openExternal(url),
    }
}
