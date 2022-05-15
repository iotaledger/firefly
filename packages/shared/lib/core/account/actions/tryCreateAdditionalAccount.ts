import { activeProfile, isSoftwareProfile } from '@core/profile'
import { openPopup } from '@lib/popup'
import { get } from 'svelte/store'
import { setSelectedAccount } from '../stores'
import { createNewAccount } from './createNewAccount'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
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
