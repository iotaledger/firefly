export enum AppRoute {
    Welcome = 'welcome',
    Legal = 'legal',
    Appearance = 'appearance',
    Profile = 'profile',
    Setup = 'setup',
    Settings = 'settings',
    // TODO: ledger replace create
    Create = 'create',
    Secure = 'secure',
    Password = 'password',
    LedgerSetup = 'ledgerSetup',
    Protect = 'protect',
    Backup = 'backup',
    Import = 'import',
    Migrate = 'migrate',
    Balance = 'balance',
    Congratulations = 'congratulations',
    Dashboard = 'dashboard',
    Login = 'login',
}

export enum SetupType {
    New = 'new',
    Import = 'import',
    Mnemonic = 'mnemonic',
    Seed = 'seed',
    Stronghold = 'stronghold',
    Seedvault = 'seedvault',
    TrinityLedger = 'trinityLedger',
    FireflyLedger = 'fireflyLedger',
}

export enum LedgerRoutes {
    Connect = 'connect',
    RestoreFromLedger = 'restoreFromLedger',
    LegacyIntro = 'legacyIntro',
    InstallationGuide = 'installationGuide',
    GenerateAddress = 'generateAddress',
    SwitchApps = 'switchApps',
    AccountIndex = 'accountIndex',
}

export enum WalletRoutes {
    Init = 'init',
    Account = 'account',
    Send = 'send',
    Receive = 'receive',
    CreateAccount = 'createAccount',
}

export enum AccountRoutes {
    Init = 'init',
    Manage = 'manage',
    Send = 'send',
    Receive = 'receive',
}

export enum Tabs {
    Wallet = 'wallet',
    Settings = 'settings',
    Staking = 'staking',
}

export enum SettingsRoutes {
    Init = 'init',
    GeneralSettings = 'generalSettings',
    Security = 'security',
    AdvancedSettings = 'advancedSettings',
    HelpAndInfo = 'helpAndInfo',
}

export enum SettingsRoutesNoProfile {
    Init = 'init',
    GeneralSettings = 'generalSettings',
    AdvancedSettings = 'advancedSettings',
    HelpAndInfo = 'helpAndInfo',
}

export enum GeneralSettings {
    Theme = 'theme',
    Language = 'language',
    Currency = 'currency',
    Notifications = 'notifications',
    NetworkStatus = 'networkStatus',
}

export enum GeneralSettingsNoProfile {
    Theme = 'theme',
    Language = 'language',
    Notifications = 'notifications',
}

export enum SecuritySettings {
    ExportStronghold = 'exportStronghold',
    AppLock = 'appLock',
    ChangePassword = 'changePassword',
    ChangePincode = 'changePincode',
    DeleteProfile = 'deleteProfile',
}

export enum AdvancedSettings {
    NetworkConfiguration = 'networkConfiguration',
    DeepLinks = 'deepLinks',
    BalanceFinder = 'balanceFinder',
    HiddenAccounts = 'hiddenAccounts',
    ErrorLog = 'errorLog',
    Diagnostics = 'diagnostics',
    MigrateLedgerIndex = 'migrateLedgerIndex',
}

export enum AdvancedSettingsNoProfile {
    DeepLinks = 'deepLinks',
    ErrorLog = 'errorLog',
    Diagnostics = 'diagnostics',
}

export enum HelpAndInfo {
    Documentation = 'documentation',
    FAQ = 'faq',
    Discord = 'discord',
    ReportAnIssue = 'reportAnIssue',
}

export enum ExternalRoute {
    Documentation = 'https://wiki.iota.org/learn/wallets/firefly/general',
    Discord = 'https://discord.iota.org',
    FAQ = 'https://wiki.iota.org/learn/wallets/firefly/faq-and-troubleshooting',
    IssueReport = 'https://github.com/iotaledger/firefly/issues',
}
