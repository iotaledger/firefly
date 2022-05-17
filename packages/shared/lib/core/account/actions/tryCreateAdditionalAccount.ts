import { activeProfile, isSoftwareProfile } from '@core/profile'
import { openPopup } from '@lib/popup'
import { get } from 'svelte/store'
import { createNewAccount } from './createNewAccount'
import { setSelectedAccount } from './setSelectedAccount'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
    if (get(activeProfile)) {
        const { isStrongholdLocked } = get(activeProfile)
        const _create = async (): Promise<void> => {
            const account = await createNewAccount(alias, color)
            setSelectedAccount(account?.id)
        }
        if (isSoftwareProfile && get(isStrongholdLocked)) {
            openPopup({ type: 'password', props: { onSuccess: _create } })
        } else {
            await _create()
        }
    }
}
