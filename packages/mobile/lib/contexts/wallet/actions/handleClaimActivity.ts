import { isStrongholdUnlocked } from '@core/profile-manager'
import { Activity, claimActivity } from '@core/wallet'
import { DrawerId, openDrawer } from '../../../auxiliary/drawer'

export async function handleClaimActivity(activity: Activity): Promise<void> {
    const isUnlocked = await isStrongholdUnlocked()
    if (isUnlocked) {
        claimActivity(activity)
    } else {
        const _onSuccess = async (): Promise<void> => {
            await handleClaimActivity(activity)
        }
        openDrawer(DrawerId.EnterPassword, { onSuccess: _onSuccess })
    }
}
