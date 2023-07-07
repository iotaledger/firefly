<script lang="ts">
    import { localize } from '@core/i18n'
    import { getNetworkHrp } from '@core/profile'
    import { BECH32_ADDRESS_LENGTH } from '@core/utils/constants'
    import { validateBech32Address } from '@core/utils/crypto'
    import { IAccountSubject, IAddressSubject } from '@core/wallet/interfaces'

    export let recipient: IAddressSubject | IAccountSubject
    export let disabled: boolean = false
    export let error: string = undefined
    export let inputElement: HTMLInputElement = undefined

    const addressPrefix = getNetworkHrp()
    let value: string

    $: value = recipient?.type === 'address' ? recipient?.address ?? '' : recipient?.account?.name ?? ''
    $: value, validateValue()

    function onInputChange(e: Event): void {
        value = (e.target as HTMLInputElement).value
        recipient = { type: 'address', address: value }
    }

    function validateValue(): void {
        error = null
        if (!recipient) {
            error = localize('error.send.recipientRequired')
        } else if (recipient?.type === 'address') {
            localize('error.send.recipientRequired')
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
        } else if (recipient?.type === 'account') {
            if (!recipient?.account?.depositAddress?.length) {
                error = localize('error.send.recipientRequired')
            }
        }
    }
</script>

<div class="flex flex-row space-x-3">
    <span class="text-gray-600">Recipient: </span>
    <input
        type="text"
        {value}
        bind:this={inputElement}
        on:input={onInputChange}
        class="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        {disabled}
        placeholder={localize('general.enterAddress')}
        spellcheck={false}
    />
</div>

<style global lang="scss">
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
