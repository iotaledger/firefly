<script lang="ts">
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { setClipboard } from '@core/utils'

    let isAddressShown: boolean = false

    const DUMMY_ADDRESS = 'iota1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98'

    function showAddress() {
        isAddressShown = true
    }

    function onCopyClick(): void {
        // TODO: Replace with proper address
        setClipboard(DUMMY_ADDRESS)
    }
</script>

<step-content class="flex flex-col items-center justify-center space-y-20 h-full">
    <div class="flex flex-col text-center px-4 space-y-4 max-w-md">
        <div class="flex items-center justify-center">
            <img
                src="assets/illustrations/implicit-account/show-one-time-address.svg"
                alt={localize('views.implicit-account.steps.step1.title')}
            />
        </div>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold}>One-time deposit</Text>
        <Text type={TextType.h5} fontSize="15" color="blue-700" darkColor="blue-700" fontWeight={FontWeight.semibold}
            >3$ - 15$ recommended</Text
        >
        <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-700" darkColor="gray-500"
            >Send enough funds to using your one-time address so the account can be generated with low waiting times.
            The funds are your to use after the account has been created.</Text
        >
    </div>
    {#if !isAddressShown}
        <div class="flex flex-row items-center space-x-24 bg-yellow-200 rounded-lg px-6 py-7 max-w-lg mb-5">
            <Text type={TextType.h4} fontWeight={FontWeight.medium} color="yellow-900" darkColor="yellow-900"
                >Do not send funds to the address more than once</Text
            >
            <Button onClick={showAddress} classes="shrink-0">Show Address</Button>
        </div>
    {:else}
        <div class="flex flex-col justify-center items-center space-y-3">
            <div
                class="flex flex-row items-center space-x-20 bg-gray-100 dark:bg-gray-800 rounded-lg px-6 py-4 max-w-lg"
            >
                <div class="flex flex-col space-y-1">
                    <Text type={TextType.h5} fontWeight={FontWeight.normal} darkColor="gray-400">One-time Address</Text>
                    <Text type={TextType.pre} fontSize="14" fontWeight={FontWeight.medium} color="gray-50"
                        >{DUMMY_ADDRESS}</Text
                    >
                </div>
                <Button outline onClick={onCopyClick} classes="shrink-0">Copy</Button>
            </div>
            <Text type={TextType.h5} fontWeight={FontWeight.normal} color="red-600" darkColor="red-600"
                >Do not sent fund to this address more than once</Text
            >
        </div>
    {/if}
</step-content>
