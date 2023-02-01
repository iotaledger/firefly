<script lang="ts">
    import { onMount } from 'svelte'
    import {
        Button,
        Dropdown,
        Error,
        FontWeight,
        OptionalInput,
        Text,
        TextInput,
        NumberInput,
        TooltipIcon,
    } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { BaseError } from '@core/error/classes'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network/stores'
    import { SupportedMimeType } from '@core/nfts/enums'
    import { MimeType } from '@core/nfts/types'
    import { isValidUri } from '@core/utils/validation'
    import { validateBech32Address } from '@core/utils/crypto'
    import { TokenStandard } from '@core/wallet/enums'
    import { mintNftDetails, setMintNftDetails } from '@core/wallet/stores'
    import { IMintNftDetails } from '@core/wallet'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let { standard, version, type, uri, amount, name, collectionName, royalties, issuerName, description, attributes } =
        $mintNftDetails

    const optionalInputs = {
        collectionName,
        royalties: JSON.stringify(royalties),
        issuerName,
        description,
        attributes: JSON.stringify(attributes),
    }
    const optionalInputErrors = {
        collectionName: '',
        royalties: '',
        issuerName: '',
        description: '',
        attributes: '',
    }

    let typeError: string, uriError: string, nameError: string, amountError: string

    const error: BaseError = null

    const nftTypeOptions = Object.keys(SupportedMimeType)
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
            setMintNftDetails(convertInputsToMetadataType(optionalInputs))
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
        if (!nftTypeOptions.map((e) => e.value).includes(type as MimeType)) {
            typeError = 'Invalid MimeType, check if the file type is supported'
        }

        if (name.length === 0) {
            nameError = 'Empty name, it is a required field'
        }

        if (Number(amount) < 1) {
            amountError = 'Amount needs to be greater than 0'
        }

        if (uri.length === 0) {
            uriError = 'Empty URI, please provide a valid URI'
        } else if (!isValidUri(uri)) {
            uriError = 'Invalid URI, please provide a valid URI'
        }

        if (optionalInputs.royalties) {
            validateRoyalties()
        }

        if (optionalInputs.attributes) {
            validateAttributes()
        }

        const hasErrors = Object.values({ ...optionalInputErrors, typeError, nameError, uriError }).some(
            (e) => e !== ''
        )
        return !hasErrors
    }

    function validateRoyalties(): void {
        let royalties: unknown
        try {
            royalties = JSON.parse(optionalInputs.royalties)
        } catch (err) {
            optionalInputErrors.royalties = 'Royalties must be a valid JSON'
            return
        }

        try {
            Object.keys(royalties).forEach((key) => validateBech32Address($networkHrp, key))
        } catch (err) {
            optionalInputErrors.royalties = `Invalid address, must be a valid ${$networkHrp} address where royalties will be sent to.`
            return
        }

        const isValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
        if (!isValuesValid) {
            optionalInputErrors.royalties =
                'Invalid value, it must be a numeric decimal representative of the percentage required ie. 0.05'
            return
        }
        const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
        if (!isSumValid) {
            optionalInputErrors.royalties = 'Invalid value, the sum of all royalties must be less than or equal to 1'
            return
        }
    }

    function validateAttributes(): void {
        let attributes: unknown
        try {
            attributes = JSON.parse(optionalInputs.attributes)
        } catch (err) {
            optionalInputErrors.attributes = 'Attributes must be a valid JSON'
            return
        }
        if (!Array.isArray(attributes)) {
            optionalInputErrors.attributes = 'Attributes must be an array'
            return
        }
        const isArrayOfObjects = attributes.every(
            (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
        )
        if (!isArrayOfObjects) {
            optionalInputErrors.attributes = 'Attributes must be an array of objects'
            return
        }
        const isKeysValid = attributes.every(
            (attribute) =>
                Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
                Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
                Object.keys(attribute).filter((key) => key === 'value').length === 1
        )
        if (!isKeysValid) {
            optionalInputErrors.attributes = 'Invalid key, attributes must have the keys "trait_type" and "value"'
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
            optionalInputErrors.attributes =
                'Invalid value, "trait_type" must be a non empty string and "value" must be a non empty string or a number'
            return
        }
    }

    function convertInputsToMetadataType(optionalInputs: { [key: string]: string }): IMintNftDetails {
        return {
            standard: standard ?? TokenStandard.Irc27,
            version,
            ...optionalInputs,
            amount,
            uri,
            name,
            royalties: optionalInputs.royalties ? JSON.parse(optionalInputs.royalties) : undefined,
            attributes: optionalInputs.attributes ? JSON.parse(optionalInputs.attributes) : undefined,
            type: type as MimeType,
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
            bind:value={type}
            bind:error={typeError}
            onSelect={handleSelectNftType}
            label={localize('general.type')}
            placeholder={localize('general.type')}
            items={nftTypeOptions}
            fontSize="sm"
            lineHeight="140"
            fontWeight={FontWeight.medium}
        />
        <TextInput
            bind:value={uri}
            bind:error={uriError}
            label={localize('general.uri')}
            placeholder={localize('general.uri')}
        >
            <TooltipIcon
                slot="right"
                text={localize('tooltips.mintNftForm.uri')}
                title={localize('general.uri')}
                width={15}
                height={15}
                classes="ml-1 flex items-center"
            />
        </TextInput>
        <TextInput
            bind:value={name}
            bind:error={nameError}
            label={localize('general.name')}
            placeholder={localize('general.name')}
        />
        <NumberInput
            bind:value={amount}
            bind:error={amountError}
            label={localize('general.amount')}
            placeholder={localize('general.amount')}
        />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            {#each Object.keys(optionalInputs) as key}
                <OptionalInput
                    bind:value={optionalInputs[key]}
                    bind:error={optionalInputErrors[key]}
                    label={localize(`general.${key}`)}
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
