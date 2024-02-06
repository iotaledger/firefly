import { Locale } from '@core/i18n'

/**
 * Returns localised Electron menu items
 *
 * @method getLocalisedMenuItems
 *
 * @param {function} locale
 *
 * @returns {object}
 */
export const getLocalisedMenuItems = (locale: Locale): unknown => ({
    about: locale('views.settings.about.title'),
    checkForUpdates: locale('actions.checkForUpdates'),
    settings: locale('views.settings.settings'),
    general: locale('views.settings.general.title'),
    security: locale('views.settings.security.title'),
    advanced: locale('views.settings.advanced.title'),
    errorLog: locale('views.settings.errorLog.title'),
    diagnostics: locale('views.settings.diagnostics.title'),
    logout: locale('views.dashboard.profileModal.logout'),
    hide: locale('actions.hide'),
    hideOthers: locale('actions.hideOthers'),
    showAll: locale('actions.showAll'),
    quit: locale('actions.quit'),
    edit: locale('actions.edit'),
    undo: locale('actions.undo'),
    redo: locale('actions.redo'),
    cut: locale('actions.cut'),
    copy: locale('actions.copy'),
    paste: locale('actions.paste'),
    selectAll: locale('actions.selectAll'),
    wallet: locale('general.wallet'),
    addWallet: locale('actions.addWallet'),
    help: locale('general.help'),
    troubleshoot: locale('views.settings.troubleshoot.title'),
    faq: locale('views.settings.faq.title'),
    documentation: locale('views.settings.documentation.title'),
    discord: locale('views.settings.discord.title'),
    reportAnIssue: locale('actions.reportAnIssue'),
    version: locale('general.version'),
})
