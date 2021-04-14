export enum AppRoute {
    Welcome = 'welcome',
    Legal = 'legal',
    Appearance = 'appearance',
    Setup = 'setup',
    Secure = 'secure',
    Password = 'password',
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
    // TODO: Implement and enable
    // Profile = 'profile',
    Theme = 'theme',
    Language = 'language',
    Currency = 'currency',
    Notifications = 'notifications',
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
    NodeSettings = 'nodeSettings',
    ProofOfWork = 'proofOfWork',
    DeveloperMode = 'developerMode',
    DeepLinks = 'deepLinks',
    ResyncAccounts = 'resyncAccounts',
    BalanceFinder = 'balanceFinder',
    HiddenAccounts = 'hiddenAccounts',
    ErrorLog = 'errorLog',
    Diagnostics = 'diagnostics',
    // TODO: Implement and enable
    //StateExport = 'stateExport',
}

export enum AdvancedSettingsNoProfile {
    DeveloperMode = 'developerMode',
    DeepLinks = 'deepLinks',
    ErrorLog = 'errorLog',
    Diagnostics = 'diagnostics',
}

export enum HelpAndInfo {
    Troubleshoot = 'troubleshoot',
    Documentation = 'documentation',
    FAQ = 'faq',
    Discord = 'discord',
    ReportAnIssue = 'reportAnIssue',
}
