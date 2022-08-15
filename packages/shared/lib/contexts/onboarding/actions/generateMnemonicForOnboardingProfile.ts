import { generateMnemonic } from '@core/profile-manager'

import { updateOnboardingProfile } from '../stores'
import { Mnemonic } from '../types'

export async function generateMnemonicForOnboardingProfile(): Promise<Mnemonic> {
    const mnemonicString = await generateMnemonic()
    const mnemnonicList = mnemonicString?.split(' ')
    updateOnboardingProfile({ mnemonic: mnemnonicList })
    return mnemnonicList
}
