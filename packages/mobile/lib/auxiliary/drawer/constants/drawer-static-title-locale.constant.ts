import { DrawerId } from '../enums'

export const DRAWER_STATIC_TITLE_TITLES = {
    [DrawerId.EnterPassword]: 'popups.password.title',
    [DrawerId.SelectedActivity]: 'popups.transactionDetails.title',
    [DrawerId.AccountSwitcher]: 'general.accounts',
    [DrawerId.CreateAccount]: 'general.createAccount',
    [DrawerId.Receive]: 'general.receiveFunds',
    [DrawerId.CustomizeAccount]: 'general.manageAccount',
    [DrawerId.BalanceBreakdown]: 'popups.balanceBreakdown.title',
    [DrawerId.References]: 'actions.addReference',
    [DrawerId.Expiration]: 'general.expirationTime',
    [DrawerId.Send]: 'popups.sendForm.title',
    [DrawerId.NetworkStatus]: 'views.settings.networkStatus.title',
    [DrawerId.Legal]: 'views.onboarding.appSetup.legal.title',
}
