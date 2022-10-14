<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTransactionDetails } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { appSettings } from '@core/app'
    import { Text, FontWeight, TextType, Icon, Modal } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    let selectedOptionIndex: number = 0
    let modal: Modal = undefined
    let isModalOpened: boolean = false

    $: darkModeEnabled = $appSettings.darkMode
    $: selectedOption = buttonOptions[selectedOptionIndex]

    const buttonOptions = [
        {
            title: localize('general.sendFunds'),
            description: localize('general.sendTokensToAddress'),
            action: onL1SendClick,
        },
        {
            title: localize('general.sendNft'),
            description: localize('general.sendNftToAddress'),
            action: onNftSendClick,
        },
    ]

    function openModal(): void {
        isModalOpened = true
        modal?.open()
    }

    function onSelection(index: number): void {
        selectedOptionIndex = index
        isModalOpened = false
        modal?.close()
    }

    function onSendClick(): void {
        selectedOption.action()
    }

    function onL1SendClick(): void {
        resetNewTransactionDetails()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }

    function onNftSendClick(): void {
        resetNewTransactionDetails()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<div class="relative">
    <div class="button-container flex flex-row justify-between rounded-xl">
        <button
            class="px-4 py-3.5 text-center w-full"
            on:click|stopPropagation={onSendClick}
            class:darkmode={darkModeEnabled}
        >
            <span class="flex flex-col justify-center items-start">
                <Text
                    type={TextType.p}
                    color="gray-800"
                    darkColor="white"
                    fontSize="14"
                    fontWeight={FontWeight.semibold}
                    lineHeight="5"
                    >{selectedOption.title}
                </Text>
                <Text
                    type={TextType.p}
                    color="gray-600"
                    darkColor="gray-400"
                    fontSize="12"
                    fontWeight={FontWeight.normal}
                    lineHeight="3.5"
                    >{selectedOption.description}
                </Text>
            </span>
        </button>
        <button class="p-4" on:click={openModal}>
            <Icon
                icon={isModalOpened ? IconEnum.ChevronUp : IconEnum.ChevronDown}
                classes={isModalOpened ? 'text-blue-500' : 'text-gray-500'}
            />
        </button>
    </div>

    <Modal
        bind:this={modal}
        position={{ left: '0', top: 'calc(100% + 8px)' }}
        classes="w-full"
        on:close={() => (isModalOpened = false)}
    >
        <action-picker-modal class="max-h-64 flex flex-col space-y-1 scrollable-y">
            {#each buttonOptions as option, index}
                <button
                    on:click={() => onSelection(index)}
                    class="w-full flex flex-row flex-1 justify-between items-center px-2 py-3 space-x-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <div class="flex w-4 justify-center items-center">
                        {#if selectedOptionIndex === index}
                            <Icon icon={IconEnum.Checkmark} classes="text-blue-500" width="16" height="16" />
                        {/if}
                    </div>
                    <Text type={TextType.p} color="gray-800" classes="w-full text-left">{option.title}</Text>
                </button>
            {/each}
        </action-picker-modal>
    </Modal>
</div>

<style type="text/scss">
    .button-container {
        min-width: 200px;
        @apply border;
        @apply border-solid;
        @apply border-gray-300;
        @apply bg-white;
        @apply text-left;
        span {
            min-height: 36px;
        }

        button {
            &:hover {
                @apply bg-blue-50;
                @apply border-gray-500;
            }

            &:active,
            &:focus {
                @apply bg-blue-100;
                @apply border-blue-400;
            }
            &:disabled {
                :global(svg) {
                    @apply text-gray-500;
                }
                @apply pointer-events-none;
                @apply bg-gray-50;
            }

            &.darkmode {
                @apply border-gray-700;
                @apply bg-transparent;
                &:hover,
                &:focus,
                &:active {
                    @apply bg-gray-700;
                    @apply bg-opacity-20;
                    @apply border-opacity-50;
                }
                &:disabled {
                    @apply bg-gray-700;
                    @apply bg-opacity-10;
                    @apply border-gray-700;
                    @apply border-opacity-10;
                }
            }

            &:first-child {
                border-top-left-radius: 0.75rem;
                border-bottom-left-radius: 0.75rem;
            }

            &:last-child {
                border-top-right-radius: 0.75rem;
                border-bottom-right-radius: 0.75rem;
            }
        }
    }
</style>
