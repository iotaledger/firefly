import { MenuItemConstructorOptions } from 'electron'
import { createRoleMenuItem } from '../helpers'

export const editMenuTemplate: MenuItemConstructorOptions[] = [
    createRoleMenuItem('undo'),
    createRoleMenuItem('redo'),
    { type: 'separator' },
    createRoleMenuItem('cut'),
    createRoleMenuItem('copy'),
    createRoleMenuItem('paste'),
    { type: 'separator' },
    createRoleMenuItem('selectAll'),
]
