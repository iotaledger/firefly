<script lang="ts">
    import { Modal, SelectorInput, IOption, NftImageOrIconBox, NftSize } from 'shared/components'
    import { INft, ownedNfts } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'
    import { localize } from '@core/i18n'
    import { time } from '@core/app'

    export let nftId: string = ''
    export let error: string = ''
    export let readonly: boolean | null = null

    let selectedNftById: INft | undefined
    let modal: Modal = undefined
    let inputElement: HTMLInputElement | undefined = undefined
    let selected: IOption = selectedNftById ? { key: selectedNftById.name, value: selectedNftById.id } : {}

    const nftOptions: IOption[] = $ownedNfts
        .filter((nft) => nft.isSpendable && (!nft.timelockTime || nft.timelockTime < $time.getTime()))
        .map((_nft) => ({ key: _nft.name, value: _nft.id }))

    $: selectedNftById = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
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
    <NftImageOrIconBox
        nft={getNftByIdFromAllAccountNfts($selectedAccountIndex, String(option?.value))}
        size={NftSize.Small}
    />
</SelectorInput>
