<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, KeyValueBox, Text, FontWeight } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { mintNft, mintNftDetails } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile'
    import { handleError } from '@core/error/handlers/handleError'
    import { closePopup, openPopup } from '@auxiliary/popup'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const { standard, type, uri, name, collectionId, collectionName, royalties, issuerName, description, attributes } =
        $mintNftDetails

    $: isTransferring = $selectedAccount.isTransferring

    let detailsList: { [key: string]: { data: unknown; tooltipText?: string; isCopyable?: boolean } } = {}
    $: detailsList = {
        ...(name && {
            name: { data: name },
        }),
        ...(type && {
            type: { data: type },
        }),
        ...(uri && {
            uri: { data: uri, isCopyable: true },
        }),
        ...(collectionId && {
            collectionId: { data: collectionId },
        }),
        ...(collectionName && {
            collectionName: { data: collectionName },
        }),
        ...(royalties && {
            royalties: { data: royalties },
        }),
        ...(issuerName && {
            issuerName: { data: issuerName },
        }),
        ...(description && {
            description: { data: description },
        }),
        ...(attributes && {
            attribute: { data: attributes },
        }),
    }

    async function mintAction(): Promise<void> {
        try {
            await mintNft({
                id: undefined,
                standard,
                version: undefined,
                name,
                type,
                uri,
                ...(collectionId && { collectionId }),
                ...(collectionName && { collectionName }),
                ...(royalties && { royalties }),
                ...(issuerName && { issuerName }),
                ...(description && { description }),
                ...(attributes && { attributes }),
            })
            closePopup()
        } catch (reason) {
            handleError(reason.error)
        }
    }

    function handleBack(): void {
        closePopup()
        openPopup({
            type: 'mintNftForm',
            overflow: true,
        })
    }

    async function handleMint(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (reason) {
            handleError(reason.error)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>
    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        {#if Object.entries(detailsList).length > 0}
            <details-list class="flex flex-col space-y-2">
                {#each Object.entries(detailsList) as [key, value]}
                    <KeyValueBox
                        keyText={localize(`popups.mintNftForm.inputs.${key}`)}
                        valueText={value.data}
                        isCopyable={value.isCopyable}
                    />
                {/each}
            </details-list>
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={handleBack}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={handleMint} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
