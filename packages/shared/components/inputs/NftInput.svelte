<script lang="typescript">
    import { Modal, SelectorInput, Text, TextType } from 'shared/components'
    import { truncateString } from '@core/utils'
    import { selectedAccountNfts } from '@core/nfts'

    export let nftId: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    export async function validate(): Promise<void> {
        if (!nftId) {
            error = 'Nft is required'
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function onClick(_selected): void {
        modal?.close()
        nftId = _selected.id
    }
</script>

<SelectorInput
    labelLocale="popups.sendNft.property.nft"
    bind:value={nftId}
    bind:inputElement
    bind:modal
    bind:error
    options={$selectedAccountNfts}
    {onClick}
    let:option
>
    <Text type={TextType.pre} fontSize="sm" color="gray-600">{option.name}</Text>
    <Text type={TextType.pre} fontSize="sm" color="gray-600">{truncateString(option.id, 9, 9)}</Text>
</SelectorInput>
