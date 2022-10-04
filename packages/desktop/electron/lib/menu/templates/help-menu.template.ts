import { MenuItemConstructorOptions } from 'electron'
import { FAQ_URL, DOCUMENTATION_URL, DISCORD_URL, ISSUE_REPORT_URL } from 'shared/lib/contexts/settings/constants'
import { createExternalUrlMenuItem } from '../helpers'

export const helpMenuTemplate: MenuItemConstructorOptions[] = [
    createExternalUrlMenuItem('faq', FAQ_URL),
    createExternalUrlMenuItem('documentation', DOCUMENTATION_URL),
    createExternalUrlMenuItem('discord', DISCORD_URL),
    createExternalUrlMenuItem('reportAnIssue', ISSUE_REPORT_URL),
]
