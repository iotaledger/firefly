import { IFeatureFlag } from './feature-flag.interface'

export interface IAccountManagementFeatures extends IFeatureFlag {
    accountList?: IFeatureFlag
    accountDetails?: IFeatureFlag
}
