import { IAccountManagementFeatures } from '@lib/features/interfaces'

const accountManagementFeatures: IAccountManagementFeatures = {
    enabled: false,
    accountList: {
        enabled: true,
    },
    accountDetails: {
        enabled: false,
    },
}

export default accountManagementFeatures
