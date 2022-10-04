import { MenuItemConstructorOptions, app } from 'electron'
import { menuState } from '../'
import { createRoleMenuItem } from '../helpers'

export const hideMenuTemplate: MenuItemConstructorOptions[] = [
    createRoleMenuItem('hide', `${menuState.strings.hide} ${app.name}`),
    createRoleMenuItem('hideOthers'),
    createRoleMenuItem('unhide'),
    { type: 'separator' },
]
