import { cleanupSignup } from '@lib/app'
import { deleteNewProfile } from '@core/profile'

export async function cleanupOnboarding(): Promise<void> {
    cleanupSignup()
    await deleteNewProfile()
}
