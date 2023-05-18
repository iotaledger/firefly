import { getSelectedAccountWrappedNativeTokens } from './'

export async function getSelectedAccountL2Tokens(): Promise<{ amount: bigint; id: string }[] | undefined> {
    const wrappedNativeTokens = await getSelectedAccountWrappedNativeTokens()
    return wrappedNativeTokens
}
