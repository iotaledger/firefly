import { getSelectedAccountLayer2BaseTokens, getSelectedAccountWrappedNativeTokens } from './';

export async function getSelectedAccountLayer2Tokens(): Promise<{ amount: bigint; id: string }[]> {
    const wrappedNativeTokens = await getSelectedAccountWrappedNativeTokens()
    const baseTokens = await getSelectedAccountLayer2BaseTokens()
    return wrappedNativeTokens
}
