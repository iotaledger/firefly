import { app, ipcMain, Menu, shell } from 'electron'
import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from 'shared/lib/contexts/settings/constants'
import features from 'shared/features/features'
import { closeAboutWindow, getOrInitWindow, openAboutWindow } from '../main'
import { menuState } from './menuState'

let state = menuState

/**
 * Creates a native menu tree and applies it to the application window
 */
export const initMenu = () => {
    let mainMenu = null

    const createMenu = () => {
        const template = buildTemplate()
        const applicationMenu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(applicationMenu)

        // setApplicationMenu sets the menu for all top level windows
        // which breaks the about window, if we try and set the about
        // window menu to null it resizes. We would also need to re-apply
        // the localisation, so just close it
        closeAboutWindow()

        return applicationMenu
    }

    app.once('ready', () => {
        ipcMain.handle('menu-update', (e, args) => {
            /* eslint-disable no-import-assign */
            state = Object.assign({}, state, args)
            mainMenu = createMenu()
        })

        ipcMain.handle('menu-popup', () => {
            mainMenu.popup(getOrInitWindow('main'))
        })

        ipcMain.handle('menu-data', () => state)

        ipcMain.handle('maximize', () => {
            const isMaximized = getOrInitWindow('main').isMaximized()
            if (isMaximized) {
                getOrInitWindow('main').restore()
            } else {
                getOrInitWindow('main').maximize()
            }
            return !isMaximized
        })

        ipcMain.handle('isMaximized', () => getOrInitWindow('main').isMaximized())

        ipcMain.handle('minimize', () => {
            getOrInitWindow('main').minimize()
        })

        ipcMain.handle('close', () => {
            getOrInitWindow('main').close()
        })

        mainMenu = createMenu()
    })
}

/**
 * Builds menu template
 * @returns {Array} Menu template
 */
const buildTemplate = () => {
    const template = [
        {
            label: app.name,
            submenu: [
                {
                    label: `${state.strings.about} ${app.name}`,
                    click: () => openAboutWindow(),
                    enabled: state.enabled,
                },
                {
                    label: `${state.strings.checkForUpdates}...`,
                    click: () => getOrInitWindow('main').webContents.send('menu-check-for-update'),
                    enabled: process.env.STAGE === 'prod' ? state.enabled : false,
                },
                {
                    type: 'separator',
                },

                {
                    label: state.strings.settings,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-settings'),
                },
                {
                    type: 'separator',
                },
                {
                    label: state.strings.createDeveloperProfile,
                    click: () => getOrInitWindow('main').webContents.send('menu-create-developer-profile'),
                    visible: state.loggedIn === false && state.hasProfile && process.env.STAGE === 'prod',
                },
                {
                    label: state.strings.createNormalProfile,
                    click: () => getOrInitWindow('main').webContents.send('menu-create-normal-profile'),
                    visible: state.loggedIn === false && state.hasProfile && process.env.STAGE !== 'prod',
                },
                {
                    label: state.strings.diagnostics,
                    click: () => getOrInitWindow('main').webContents.send('menu-diagnostics'),
                },
            ],
        },
    ]

    if (!app.isPackaged || features?.electron?.developerTools?.enabled) {
        template[0].submenu.push({
            label: 'Developer Tools',
            role: 'toggleDevTools',
        })
    }

    template[0].submenu = template[0].submenu.concat([
        {
            label: state.strings.errorLog,
            click: () => getOrInitWindow('main').webContents.send('menu-error-log'),
        },
        {
            type: 'separator',
        },
    ])

    if (process.platform === 'darwin') {
        template[0].submenu = template[0].submenu.concat([
            {
                label: `${state.strings.hide} ${app.name}`,
                role: 'hide',
            },
            {
                label: state.strings.hideOthers,
                role: 'hideothers',
            },
            {
                label: state.strings.showAll,
                role: 'unhide',
            },
            {
                type: 'separator',
            },
        ])
    }

    template[0].submenu = template[0].submenu.concat([
        {
            label: state.strings.quit,
            accelerator: process.platform === 'win32' ? 'Alt+F4' : 'CmdOrCtrl+Q',
            click: function () {
                app.quit()
            },
        },
    ])

    template.push({
        label: state.strings.edit,
        submenu: [
            { label: state.strings.undo, accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
            { label: state.strings.redo, accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
            { type: 'separator' },
            { label: state.strings.cut, accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
            { label: state.strings.copy, accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
            { label: state.strings.paste, accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
            { label: state.strings.selectAll, accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
        ],
    })

    if (state.loggedIn) {
        template.push({
            label: state.strings.wallet,
            submenu: [
                {
                    type: 'separator',
                },
                {
                    label: state.strings.logout,
                    click: () => getOrInitWindow('main').webContents.send('menu-logout'),
                    enabled: state.enabled,
                },
            ],
        })
    }

    template.push({
        label: state.strings.help,
        submenu: [
            // {
            //     label: state.strings.troubleshoot,
            //     click: function () {
            //         // TODO: Replace with real help links
            //         shell.openExternal('https://iota.org')
            //     },
            // },
            {
                label: state.strings.faq,
                click: function () {
                    shell.openExternal(FAQ_URL)
                },
            },
            {
                label: state.strings.documentation,
                click: function () {
                    shell.openExternal(DOCUMENTATION_URL)
                },
            },
            {
                label: state.strings.discord,
                click: function () {
                    shell.openExternal(DISCORD_URL)
                },
            },
            {
                label: state.strings.reportAnIssue,
                click: function () {
                    shell.openExternal(ISSUE_REPORT_URL)
                },
            },
        ],
    })
    return template
}

/**
 * Creates context menu
 * @returns {Menu} Context menu
 */
export const contextMenu = () =>
    Menu.buildFromTemplate([
        {
            label: state.strings.undo,
            role: 'undo',
        },
        {
            label: state.strings.redo,
            role: 'redo',
        },
        {
            type: 'separator',
        },
        {
            label: state.strings.cut,
            role: 'cut',
        },
        {
            label: state.strings.copy,
            role: 'copy',
        },
        {
            label: state.strings.paste,
            role: 'paste',
        },
        {
            type: 'separator',
        },
        {
            label: state.strings.selectAll,
            role: 'selectAll',
        },
    ])
