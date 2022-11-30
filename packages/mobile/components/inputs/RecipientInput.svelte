<script lang="typescript">
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network/stores'
    import { BECH32_ADDRESS_LENGTH } from '@core/utils/constants'
    import { validateBech32Address } from '@core/utils/crypto'
    import { IAddressSubject } from '@core/wallet/interfaces'

    export let recipient: IAddressSubject
    export let disabled: boolean = false
    export let error: string = undefined

    let addressPrefix: string
    let value: string

    $: addressPrefix = $networkHrp
    $: value = recipient?.address ?? ''
    $: value, validateValue()

    function onInputChange(e: Event): void {
        value = (e.target as HTMLInputElement).value
        recipient = { type: 'address', address: value }
    }

    function validateValue(): void {
        error = null
        if (!value?.length) {
            error = localize('general.enterAddress')
        } else if (value?.length !== BECH32_ADDRESS_LENGTH + addressPrefix.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: BECH32_ADDRESS_LENGTH + addressPrefix.length,
                },
            })
        } else {
            try {
                validateBech32Address(addressPrefix, value)
            } catch (err) {
                error = err?.message ?? err
            }
        }
    }
</script>

<div class="flex flex-row space-x-3">
    <span class="text-gray-600">Recipient: </span>
    <input
        type="text"
        {value}
        on:input={onInputChange}
        class="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        {disabled}
        placeholder={localize('general.enterAddress')}
        spellcheck={false}
    />
</div>

<style global type="text/scss">
    div {
        height: fit-content;
    }
    * {
        @apply font-semibold;
        @apply text-15;
        @apply leading-5;
    }
    input::placeholder {
        @apply text-gray-500;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
</style>
