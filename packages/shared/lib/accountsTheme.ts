import { persistent } from 'shared/lib/helpers'

/**
 * AccountTheme interface
 */
export interface AccountTheme {
    accountId: string
    color: string
    pattern: string
}

export const accountsTheme = persistent<AccountTheme[]>('accountsTheme', [])

export const setAccountTheme = (accountId: string, color: string, pattern: string) => {
    const accountTheme = { accountId, color, pattern }

    accountsTheme.update(_accountsTheme => {
        if (_accountsTheme.find(e => e.accountId === accountId)) {
            return _accountsTheme.map(e => e.accountId === accountId ? accountTheme : e)
        }
        return [..._accountsTheme, accountTheme]
    })
}
