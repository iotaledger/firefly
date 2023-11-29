import { api } from '@core/api'
import { updateOnboardingProfile } from '../stores'
import { Mnemonic } from '../types'

export async function generateMnemonicForOnboardingProfile(): Promise<Mnemonic> {
    const mnemonicString = await api.generateMnemonic()
    const mnemnonicList = mnemonicString?.split(' ')
    updateOnboardingProfile({ mnemonic: mnemnonicList })
    return mnemnonicList
}
