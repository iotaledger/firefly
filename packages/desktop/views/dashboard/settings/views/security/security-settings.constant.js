import { AppLock, ChangePassword, ChangePincode, ExportStronghold } from './'
import { SecuritySettingsRoute } from '@core/router'

export const SECURITY_SETTINGS = [
    { component: AppLock, childRoute: SecuritySettingsRoute.AppLock },
    { component: ChangePincode, childRoute: SecuritySettingsRoute.ChangePincode },
    { component: ChangePassword, childRoute: SecuritySettingsRoute.ChangePassword, requiresSoftwareProfile: true },
    { component: ExportStronghold, childRoute: SecuritySettingsRoute.ExportStronghold, requiresSoftwareProfile: true },
]
