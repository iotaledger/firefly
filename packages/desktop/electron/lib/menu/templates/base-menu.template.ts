import { MenuItemConstructorOptions, app } from 'electron'
import { openAboutWindow, getOrInitWindow } from '../../../main'
import { menuState } from '../'
import { MenuEvent } from '../enums'

export const baseMenuTemplate: MenuItemConstructorOptions[] = [
    {
        label: `${menuState.strings.about} ${app.name}`,
        click: openAboutWindow,
        enabled: menuState.enabled,
    },
    {
        label: `${menuState.strings.checkForUpdates}...`,
        click: () => getOrInitWindow('main').webContents.send(MenuEvent.CheckForUpdate),
        enabled: process.env.STAGE === 'prod' ? menuState.enabled : false,
    },
    { type: 'separator' },

    {
        label: menuState.strings.settings,
        click: () => getOrInitWindow('main').webContents.send(MenuEvent.NavigateSettings),
    },
    { type: 'separator' },
    {
        label: menuState.strings.createDeveloperProfile,
        click: () => getOrInitWindow('main').webContents.send(MenuEvent.CreateDeveloperProfile),
        visible: menuState.canCreateNewProfile,
    },
    {
        label: menuState.strings.createNormalProfile,
        click: () => getOrInitWindow('main').webContents.send(MenuEvent.CreateNormalProfile),
        visible: menuState.canCreateNewProfile,
    },
    {
        label: menuState.strings.diagnostics,
        click: () => getOrInitWindow('main').webContents.send(MenuEvent.Diagnostics),
    },
]
