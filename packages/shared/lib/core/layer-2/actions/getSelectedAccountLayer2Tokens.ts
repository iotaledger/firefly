import { getSelectedAccountWrappedNativeTokens } from './getSelectedAccountWrappedNativeTokens'

export async function getSelectedAccountLayer2Tokens(): Promise<unknown[]> {
    const wrappedNativeTokens = await getSelectedAccountWrappedNativeTokens()
    return [...wrappedNativeTokens]
}
