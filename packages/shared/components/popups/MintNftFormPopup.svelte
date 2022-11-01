<script lang="typescript">
    import { onMount } from 'svelte'
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { setMintNftDetails, mintNftDetails, TokenStandard } from '@core/wallet'
    import { handleError } from '@core/error/handlers/handleError'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { Button, Dropdown, Error, FontWeight, OptionalInput, Text, TextInput } from 'shared/components'
    import { MimeType } from '@core/nfts'
    import { NftMimeType, INftMetadata } from '@core/collectibles'
    import { isValidUrl, validateBech32Address } from '@core/utils'
    import { networkHrp } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const { standard, version, ...metadata } = $mintNftDetails

    type Inputs = { [key in keyof typeof metadata]: string }
    const inputs = Object.fromEntries(Object.entries(metadata).map(([key]) => [key, ''])) as Inputs

    type InputErrors = Inputs
    const inputErrors = Object.fromEntries(Object.entries(inputs).map(([key]) => [key, ''])) as InputErrors

    const error: BaseError = null

    const nftTypeOptions = Object.keys(NftMimeType)
        .filter((key) => Number.isNaN(Number(key)))
        .map((type) => ({
            label: type as MimeType,
            value: type as MimeType,
        }))

    function handleCancel(): void {
        closePopup()
    }

    function handleContinue(): void {
        const valid = validate()
        if (valid) {
            setMintNftDetails(convertInputsToMetadataType(inputs))
            openPopup({
                type: 'mintNftConfirmation',
                overflow: true,
            })
        }
    }

    function handleSelectNftType(item: { label: MimeType; value: MimeType }): void {
        inputs.type = item.value
    }

    function validate(): boolean {
        if (!nftTypeOptions.map((e) => e.value).includes(inputs.type as MimeType)) {
            inputErrors.type = 'Invalid MimeType, check if the file type is supported'
        }

        if (inputs.name.length === 0) {
            inputErrors.name = 'Empty name, it is a required field'
        }

        if (inputs.uri.length === 0) {
            inputErrors.uri = 'Empty URI, please provide a valid URI'
        } else if (!isValidUrl(inputs.uri)) {
            inputErrors.uri = 'Invalid URI, please provide a valid URI'
        }

        if (inputs.royalties) {
            validateRoyalties()
        }

        if (inputs.attributes) {
            validateAttributes()
        }

        const hasErrors = Object.values(inputErrors).some((e) => e !== '')
        return !hasErrors
    }

    function validateRoyalties(): void {
        let royalties: unknown
        try {
            royalties = JSON.parse(inputs.royalties)
        } catch (err) {
            inputErrors.royalties = 'Royalties must be a valid JSON'
            return
        }

        const isKeysValid = Object.keys(royalties).every((key) => !validateBech32Address($networkHrp, key))
        if (!isKeysValid) {
            inputErrors.royalties = `Invalid address, must be a valid ${$networkHrp} address where royalties will be sent to.`
            return
        }
        const isValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
        if (!isValuesValid) {
            inputErrors.royalties =
                'Invalid value, it must be a numeric decimal representative of the percentage required ie. 0.05'
            return
        }
        const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
        if (!isSumValid) {
            inputErrors.royalties = 'Invalid value, the sum of all royalties must be less than or equal to 1'
            return
        }
    }

    function validateAttributes(): void {
        let attributes: unknown
        try {
            attributes = JSON.parse(inputs.attributes)
        } catch (err) {
            inputErrors.attributes = 'Attributes must be a valid JSON'
            return
        }

        if (!Array.isArray(attributes)) {
            inputErrors.attributes = 'Attributes must be an array'
            return
        }
        const isArrayOfObjects = attributes.every(
            (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
        )
        if (!isArrayOfObjects) {
            inputErrors.attributes = 'Attributes must be an array of objects'
            return
        }
        const isKeysValid = attributes.every(
            (attribute) =>
                Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
                Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
                Object.keys(attribute).filter((key) => key === 'value').length === 1
        )
        if (!isKeysValid) {
            inputErrors.attributes = 'Invalid key, attributes must have the keys "trait_type" and "value"'
            return
        }
        const isValuesValid = attributes.every(
            (attribute) =>
                (typeof attribute.trait_type === 'string' &&
                    attribute.trait_type.length > 0 &&
                    typeof attribute.value === 'string' &&
                    attribute.value.length > 0) ||
                typeof attribute.value === 'number'
        )
        if (!isValuesValid) {
            inputErrors.attributes =
                'Invalid value, "trait_type" must be a non empty string and "value" must be a non empty string or a number'
            return
        }
    }

    function convertInputsToMetadataType(inputs: Inputs): INftMetadata {
        return {
            standard: standard ?? TokenStandard.IRC27,
            version,
            ...inputs,
            royalties: inputs.royalties ? JSON.parse(inputs.royalties) : undefined,
            attributes: inputs.attributes ? JSON.parse(inputs.attributes) : undefined,
            type: inputs.type as MimeType,
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>

    <popup-inputs class="block space-y-4 max-h-100 scrollable-y overflow-x-hidden flex-1">
        <Dropdown
            bind:value={inputs.type}
            bind:error={inputErrors.type}
            onSelect={handleSelectNftType}
            label={localize('popups.mintNftForm.inputs.type')}
            placeholder={localize('popups.mintNftForm.inputs.type')}
            items={nftTypeOptions}
            fontSize="sm"
            lineHeight="140"
            fontWeight={FontWeight.medium}
        />
        <TextInput
            bind:value={inputs.uri}
            bind:error={inputErrors.uri}
            label={localize('popups.mintNftForm.inputs.uri')}
            placeholder={localize('popups.mintNftForm.inputs.uri')}
        />
        <TextInput
            bind:value={inputs.name}
            bind:error={inputErrors.name}
            label={localize('popups.mintNftForm.inputs.name')}
            placeholder={localize('popups.mintNftForm.inputs.name')}
        />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            {#each Object.keys(inputs).filter((key) => !['type', 'uri', 'name'].includes(key)) as key}
                <OptionalInput
                    bind:value={inputs[key]}
                    bind:error={inputErrors[key]}
                    label={localize(`popups.mintNftForm.inputs.${key}`)}
                    description={localize(`tooltips.mintNftForm.${key}`)}
                    fontSize="14"
                />
            {/each}
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </popup-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={handleContinue}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</div>
