import { getSelectedAccountWrappedNativeTokens } from '.'

export async function getSelectedAccountLayer2Tokens(): Promise<{ amount: bigint; id: string }[] | undefined> {
    const wrappedNativeTokens = await getSelectedAccountWrappedNativeTokens()
    return wrappedNativeTokens
}
