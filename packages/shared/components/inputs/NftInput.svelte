<script lang="typescript">
    import { Modal, SelectorInput, IOption, NftMedia } from 'shared/components'
    import { selectedAccountNfts } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'
    import { localize } from '@core/i18n'

    export let nftId: string = ''
    export let error: string = ''
    export let readonly: boolean = null

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
    let selected: IOption = nftId
        ? { key: getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId).name, value: nftId }
        : {}

    const nftOptions: IOption[] = $selectedAccountNfts.map((_nft) => ({ key: _nft.name, value: _nft.id }))

    $: nftId = selected?.value

    export async function validate(): Promise<void> {
        if (!nftId) {
            error = localize('error.send.nftRequired')
            return Promise.reject(error)
        } else if (!nftId.startsWith('0x')) {
            error = localize('error.send.nftNotInHex')
            return Promise.reject(error)
        } else if (!isNftInPossession()) {
            error = localize('error.send.nftNotInPossession')
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function isNftInPossession(): boolean {
        return nftOptions.some((option) => option.value === nftId)
    }
</script>

<SelectorInput
    labelLocale="popups.sendNft.property.nft"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    {readonly}
    options={nftOptions}
    let:option
>
    <NftMedia nftId={option.value} classes="p-1 w-6 h-6 bg-gray-500 dark:bg-gray-500 rounded-md" />
</SelectorInput>
