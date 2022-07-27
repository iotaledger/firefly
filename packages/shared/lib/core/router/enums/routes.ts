export enum AppRoute {
    Welcome = 'welcome',
    Legal = 'legal',
    CrashReporting = 'crashReporting',
    LanguageAndAppearance = 'languageAndAppearance',
    Profile = 'profile',
    Setup = 'setup',
    // TODO: ledger replace create
    Create = 'create',
    Protocol = 'protocol',
    Network = 'network',
    CustomNetwork = 'customNetwork',
    Secure = 'secure',
    Password = 'password',
    LedgerSetup = 'ledgerSetup',
    Protect = 'protect',
    Backup = 'backup',
    Import = 'import',
    Migrate = 'migrate',
    Balance = 'balance',
    ClaimRewards = 'claimRewards',
    Congratulations = 'congratulations',
    Dashboard = 'dashboard',
    Login = 'login',
}

export enum LedgerRoute {
    Connect = 'connect',
    RestoreFromLedger = 'restoreFromLedger',
    LegacyIntro = 'legacyIntro',
    InstallationGuide = 'installationGuide',
    GenerateAddress = 'generateAddress',
    SwitchApps = 'switchApps',
    AccountIndex = 'accountIndex',
}

export enum AccountRoute {
    Init = 'init',
    Manage = 'manage',
}

export enum DashboardRoute {
    Wallet = 'wallet',
    Settings = 'settings',
    Staking = 'staking',
    DeveloperTools = 'developerTools',
}

export enum SettingsRoute {
    Init = 'init',
    General = 'general',
    Security = 'security',
    Advanced = 'advanced',
    HelpAndInfo = 'helpAndInfo',
}

export enum SettingsRouteNoProfile {
    Init = 'init',
    General = 'general',
    Advanced = 'advanced',
    HelpAndInfo = 'helpAndInfo',
}

export enum GeneralSettings {
    Theme = 'theme',
    Language = 'language',
    Currency = 'currency',
    Notifications = 'notifications',
    NetworkStatus = 'networkStatus',
    ChangeProfileName = 'changeProfileName',
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
    WalletFinder = 'walletFinder',
    HiddenAccounts = 'hiddenAccounts',
    ErrorLog = 'errorLog',
    CrashReporting = 'crashReporting',
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
    Faq = 'faq',
    Discord = 'discord',
    ReportAnIssue = 'reportAnIssue',
}

export enum ExternalRoute {
    Documentation = 'https://wiki.iota.org/learn/wallets/firefly/general',
    Discord = 'https://discord.iota.org',
    FAQ = 'https://wiki.iota.org/learn/wallets/firefly/faq-and-troubleshooting',
    IssueReport = 'https://github.com/iotaledger/firefly/issues/new/choose',
}

export enum LoginRoute {
    SelectProfile = 'selectProfile',
    EnterPin = 'enterPin',
}

export enum BackupRoute {
    Init = 'init',
    RecoveryPhrase = 'recoveryPhrase',
    Verify = 'verify',
    Backup = 'backup',
}

export enum ImportRoute {
    Init = 'init',
    TextImport = 'textImport',
    FileImport = 'fileImport',
    LedgerImport = 'ledgerImport',
    BackupPassword = 'backupPassword',
    Success = 'Success',
}

export enum ProtectRoute {
    ChooseProtectionMethod = 'chooseProtectionMethod',
    SetupBiometricProtection = 'setupBiometricProtection',
    SetupPinProtection = 'setupPinProtection',
}

export enum MigrateRoute {
    Init = 'init',
    TransferFragmentedFunds = 'transferFragmentedFunds',
    BundleMiningWarning = 'bundleMiningWarning',
    SecureSpentAddresses = 'secureSpentAddresses',
    SecuringSpentAddresses = 'securingSpentAddresses',
    SecurityCheckCompleted = 'securityCheckCompleted',
}
