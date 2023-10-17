import { IFeatureFlag } from './feature-flag.interface'

interface IGeneralSettingsFeatures extends IFeatureFlag {
    theme: IFeatureFlag
    language: IFeatureFlag
    notifications: IFeatureFlag
    crashReporting: IFeatureFlag
    deepLinks: IFeatureFlag
}

interface IProfileSettingsFeatures extends IFeatureFlag {
    changeProfileName: IFeatureFlag
    currency: IFeatureFlag
    deleteProfile: IFeatureFlag
}

interface ISecuritySettingsFeatures extends IFeatureFlag {
    appLock: IFeatureFlag
    strongholdPasswordTimeout: IFeatureFlag
    changePincode: IFeatureFlag
    changePassword: IFeatureFlag
    exportStronghold: IFeatureFlag
}

interface ICollectiblesSettingsFeatures extends IFeatureFlag {
    maxMediaSize: IFeatureFlag
    maxMediaDownloadTime: IFeatureFlag
    refreshNftMedia: IFeatureFlag
}

interface INetworkSettingsFeatures extends IFeatureFlag {
    networkInformation: IFeatureFlag
    configureNodeList: IFeatureFlag
    localProofOfWork: IFeatureFlag
}

interface IAdvancedSettingsFeatures extends IFeatureFlag {
    balanceFinder: IFeatureFlag
    hiddenAccounts: IFeatureFlag
    developerToggle: IFeatureFlag
}

interface IHelpAndInfoSettingsFeatures extends IFeatureFlag {
    diagnostics: IFeatureFlag
    errorLog: IFeatureFlag
    documentation: IFeatureFlag
    faq: IFeatureFlag
    discord: IFeatureFlag
    reportAnIssue: IFeatureFlag
}

export interface ISettingsFeatures extends IFeatureFlag {
    general: IGeneralSettingsFeatures
    profile: IProfileSettingsFeatures
    security: ISecuritySettingsFeatures
    collectibles: ICollectiblesSettingsFeatures
    network: INetworkSettingsFeatures
    advanced: IAdvancedSettingsFeatures
    helpAndInfo: IHelpAndInfoSettingsFeatures
}
