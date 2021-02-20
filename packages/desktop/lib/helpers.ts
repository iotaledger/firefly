/**
 * Returns localised Electron menu items 
 *
 * @method getLocalisedMenuItems
 *
 * @param {function} locale
 *
 * @returns {object}
 */
export const getLocalisedMenuItems = (locale) => {
    return {
        about: locale('views.settings.about.title'),
        checkForUpdates: locale('actions.checkForUpdates'),
        settings: locale('views.settings.settings'),
        generalSettings: locale('views.settings.generalSettings.title'),
        security: locale('views.settings.security.title'),
        advancedSettings: locale('views.settings.advancedSettings.title'),
        errorLog: locale('views.settings.errorLog.title'),
        logout: locale('views.dashboard.profile_modal.logout'),
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
        send: locale('actions.send'),
        receive: locale('actions.receive'),
        addAccount: locale('actions.addAccount'),
        help: locale('general.help'),
        troubleshoot: locale('views.settings.troubleshoot.title'),
        faq: locale('views.settings.faq.title'),
        documentation: locale('views.settings.documentation.title'),
        discord: locale('views.settings.discord.title'),
        reportAnIssue: locale('actions.reportAnIssue')
    }
}