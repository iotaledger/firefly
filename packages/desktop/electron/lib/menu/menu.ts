import { app, ipcMain, Menu } from 'electron'
import { closeAboutWindow, getOrInitWindow } from '../../main'
import { menuState } from './menu-state'
import { WindowEvent } from '../enums'
import { MenuEvent } from './enums'
import { createTemplate } from './menu-template'

let state = menuState
let mainMenu: Menu | null = null

// Creates a native menu tree and applies it to the application window
export function initMenu(): void {
    app.once('ready', () => {
        initListeners()
        mainMenu = createMenu()
    })
}

function createMenu(): Menu {
    const template = createTemplate()
    const applicationMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(applicationMenu)
    // setApplicationMenu sets the menu for all top level windows
    // which breaks the about window, if we try and set the about
    // window menu to null it resizes. We would also need to re-apply
    // the localisation, so just close it
    closeAboutWindow()
    return applicationMenu
}

function initListeners(): void {
    ipcMain.handle(MenuEvent.Update, (e, args): void => {
        state = Object.assign({}, state, args)
        mainMenu = createMenu()
    })
    ipcMain.handle(MenuEvent.Popup, (): void => mainMenu?.popup({ window: getOrInitWindow('main') }))
    ipcMain.handle(MenuEvent.Data, () => state)

    ipcMain.handle(WindowEvent.Maximize, (): boolean => {
        const isMaximized = getOrInitWindow('main').isMaximized()
        if (isMaximized) {
            getOrInitWindow('main').restore()
        } else {
            getOrInitWindow('main').maximize()
        }
        return !isMaximized
    })
    ipcMain.handle(WindowEvent.isMaximized, (): boolean => getOrInitWindow('main').isMaximized())
    ipcMain.handle(WindowEvent.Minimize, (): void => getOrInitWindow('main').minimize())
    ipcMain.handle(WindowEvent.Close, (): void => getOrInitWindow('main').close())
}
