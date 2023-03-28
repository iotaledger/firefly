import { HelpAndInfoRoute } from '@core/router'
import { Diagnostics, ErrorLog, HelpSection } from '.'
import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings'

export const HELP_SETTINGS = [
    { component: Diagnostics, childRoute: HelpAndInfoRoute.Diagnostics },
    { component: ErrorLog, childRoute: HelpAndInfoRoute.ErrorLog },
    {
        component: HelpSection,
        childRoute: HelpAndInfoRoute.Documentation,
        props: {
            url: DOCUMENTATION_URL,
            actionLocale: 'readDocumentation',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpAndInfoRoute.Faq,
        props: {
            url: FAQ_URL,
            actionLocale: 'visitFaq',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpAndInfoRoute.Discord,
        props: {
            url: DISCORD_URL,
            actionLocale: 'visitDiscord',
        },
    },
    {
        component: HelpSection,
        childRoute: HelpAndInfoRoute.ReportAnIssue,
        props: {
            url: ISSUE_REPORT_URL,
            actionLocale: 'reportAnIssue',
        },
    },
]
