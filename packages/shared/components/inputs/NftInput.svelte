<script lang="ts">
    import { Modal, SelectorInput, IOption, NftImageOrIconBox, NftSize } from 'shared/components'
    import { ownedNfts } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedWalletId } from '@core/wallet
    import { localize } from '@core/i18n'
    import { time } from '@core/app'

    export let nftId: string = ''
    export let error: string = ''
    export let readonly: boolean | null = null

    let inputElement: HTMLInputElement | undefined = undefined
    let modal: Modal = undefined
    const selectedNft = getNftByIdFromAllAccountNfts($selectedWalletId, nftId)
    let selected: IOption | undefined = selectedNft
        ? { key: selectedNft.name, value: selectedNft.id }
        : { value: nftId }

    const nftOptions: IOption[] = $ownedNfts
        .filter((nft) => nft.isSpendable && (!nft.timelockTime || nft.timelockTime < $time.getTime()))
        .map((_nft) => ({ key: _nft.name, value: _nft.id }))

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
        nft={getNftByIdFromAllAccountNfts($selectedWalletId, String(option?.value))}
        size={NftSize.Small}
    />
</SelectorInput>
