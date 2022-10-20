<script lang="typescript">
    import { onMount } from 'svelte'
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { setMintNftDetails, mintNftDetails, MimeType, TokenStandard } from '@core/wallet'
    import { handleError } from '@core/error/handlers/handleError'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { Button, Dropdown, Error, FontWeight, OptionalInput, Text, TextInput } from 'shared/components'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let { type, uri, name, collectionId, collectionName, royalties, issuerName, description, attributes } =
        $mintNftDetails

    let nameError: string = ''
    $: name, (nameError = '')
    let uriError: string = ''
    $: uri, (uriError = '')
    let typeError: string = ''
    $: type, (typeError = '')

    let error: BaseError

    const nftTypeOptions: { label: MimeType; value: MimeType }[] = [
        { label: 'image/jpeg', value: 'image/jpeg' },
        { label: 'image/png', value: 'image/png' },
        { label: 'image/gif', value: 'image/gif' },
        { label: 'application/pdf', value: 'application/pdf' },
        { label: 'text/plain', value: 'text/plain' },
    ]

    function handleCancel(): void {
        closePopup()
    }

    function handleContinue(): void {
        const valid = validate()
        if (valid) {
            setMintNftDetails({
                id: undefined,
                standard: TokenStandard.IRC27,
                version: undefined,
                type,
                uri,
                name,
                collectionId,
                collectionName,
                royalties,
                issuerName,
                description,
                attributes,
            })
            openPopup({
                type: 'mintNftConfirmation',
                overflow: true,
            })
        }
    }

    function handleSelectNftType(item: { label: MimeType; value: MimeType }): void {
        type = item.value
    }

    function validate(): boolean {
        // TODO: implement validation
        return true
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(error)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y overflow-x-hidden flex-1">
        <Dropdown
            bind:value={type}
            onSelect={handleSelectNftType}
            label={localize('popups.mintNftForm.inputs.type')}
            placeholder={localize('popups.mintNftForm.inputs.type')}
            items={nftTypeOptions}
            fontSize="sm"
            lineHeight="140"
            fontWeight={FontWeight.medium}
            error={typeError}
        />
        <TextInput
            bind:value={uri}
            label={localize('popups.mintNftForm.inputs.uri')}
            placeholder={localize('popups.mintNftForm.inputs.uri')}
            error={uriError}
        />
        <TextInput
            bind:value={name}
            label={localize('popups.mintNftForm.inputs.name')}
            placeholder={localize('popups.mintNftForm.inputs.name')}
            error={nameError}
        />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:value={collectionId}
                label={localize('popups.mintNftForm.inputs.collectionId')}
                description={localize('tooltips.mintNftForm.collectionId')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={collectionName}
                label={localize('popups.mintNftForm.inputs.collectionName')}
                description={localize('tooltips.mintNftForm.collectionName')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={royalties}
                label={localize('popups.mintNftForm.inputs.royalties')}
                description={localize('tooltips.mintNftForm.royalties')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={issuerName}
                label={localize('popups.mintNftForm.inputs.issuerName')}
                description={localize('tooltips.mintNftForm.issuerName')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={description}
                label={localize('popups.mintNftForm.inputs.description')}
                description={localize('tooltips.mintNftForm.description')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={attributes}
                label={localize('popups.mintNftForm.inputs.attributes')}
                description={localize('tooltips.mintNftForm.attributes')}
                fontSize="14"
            />
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={handleContinue}>
            {localize('actions.continue')}
        </Button>
    </div>
</div>
