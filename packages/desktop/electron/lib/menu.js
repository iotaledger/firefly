import { app, ipcMain, Menu, shell } from 'electron'
import { WalletRoutes } from 'shared/lib/typings/routes'
import { closeAboutWindow, getOrInitWindow, openAboutWindow } from '../main'
import { menuState as state } from './menuState'
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
                getOrInitWindow('main').restore();
            } else {
                getOrInitWindow('main').maximize();
            }
            return !isMaximized
        })

        ipcMain.handle('isMaximized', () => {
            return getOrInitWindow('main').isMaximized()
        })

        ipcMain.handle('minimize', () => {
            getOrInitWindow('main').minimize();
        })

        ipcMain.handle('close', () => {
            getOrInitWindow('main').close();
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
                    enabled: state.enabled,
                },
                {
                    type: 'separator',
                },
                {        
                    // TODO: Remove before Ledger release
                    label:  "Developer Tools",
                    role: 'toggleDevTools'
                },
                {
                    label: state.strings.settings,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-settings'),
                },
                {
                    type: 'separator',
                },
                {
                    label: state.strings.diagnostics,
                    click: () => getOrInitWindow('main').webContents.send('menu-diagnostics'),
                },
            ]
        }
    ]

    if (!app.isPackaged) {
        template[0].submenu.push(
            {
                label: "Developer Tools",
                role: 'toggleDevTools'
            }
        )
    }

    template[0].submenu = template[0].submenu.concat([
        {
            label: state.strings.errorLog,
            click: () => getOrInitWindow('main').webContents.send('menu-error-log')
        },
        {
            type: 'separator',
        },
    ]
    )

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
            accelerator: 'Command+Q',
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
                    label: state.strings.send,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-wallet', WalletRoutes.Send),
                    enabled: state.enabled,
                },
                {
                    label: state.strings.receive,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-wallet', WalletRoutes.Receive),
                    enabled: state.enabled,
                },
                {
                    type: 'separator',
                },
                {
                    label: state.strings.addAccount,
                    click: () => getOrInitWindow('main').webContents.send('menu-navigate-wallet', WalletRoutes.CreateAccount),
                    enabled: state.enabled,
                },
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
                    shell.openExternal('https://firefly.iota.org/faq')
                },
            },
            {
                label: state.strings.documentation,
                click: function () {
                    shell.openExternal('https://chrysalis.docs.iota.org/')
                },
            },
            {
                label: state.strings.discord,
                click: function () {
                    shell.openExternal('https://discord.iota.org')
                },
            },
            {
                label: state.strings.reportAnIssue,
                click: function () {
                    shell.openExternal('https://github.com/iotaledger/firefly/issues')
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
export const contextMenu = () => {
    return Menu.buildFromTemplate([
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
}
