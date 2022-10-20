<script lang="typescript">
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { mintNft, setMintNftDetails, mintNftDetails } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { Button, Dropdown, Error, FontWeight, OptionalInput, Text, TextInput } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { DropdownChoice } from '@core/utils'

    let { type, uri, name, collectionId, collectionName, issuerName, description, attribute } = $mintNftDetails

    let nameError: string = ''
    $: name, (nameError = '')
    let uriError: string = ''
    $: uri, (uriError = '')
    let typeError: string = ''
    $: type, (typeError = '')

    $: isTransferring = $selectedAccount.isTransferring

    let error: BaseError
    const nftTypeOptions: DropdownChoice[] = [
        { label: 'image/jpeg', value: 'image/jpeg' },
        { label: 'image/png', value: 'image/png' },
        { label: 'image/gif', value: 'image/gif' },
        { label: 'application/pdf', value: 'application/pdf' },
        { label: 'text/plain', value: 'text/plain' },
    ]

    async function mintAction(): Promise<void> {
        // TODO: implement
        await mintNft()
    }

    function handleCancel() {
        closePopup()
    }

    async function handleMint() {
        error = null
        const valid = validate()
        if (valid) {
            try {
                setMintNftDetails({
                    type,
                    uri,
                    name,
                    collectionId,
                    collectionName,
                    issuerName,
                    description,
                    attribute,
                })
                await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
            } catch (reason) {
                if (!error) {
                    error = reason.error
                        ? new BaseError({
                              message: reason.error ?? reason.message,
                              logToConsole: true,
                              saveToErrorLog: true,
                          })
                        : reason
                }
            }
        }
    }

    function handleSelectNftType(item: DropdownChoice) {
        type = item.value
    }

    function validate(): boolean {
        // TODO: implement
        return true
    }
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
                bind:value={attribute}
                label={localize('popups.mintNftForm.inputs.attribute')}
                description={localize('tooltips.mintNftForm.attribute')}
                fontSize="14"
            />
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={handleMint} isBusy={isTransferring}>
            {localize('actions.mint')}
        </Button>
    </div>
</div>
