<script lang="typescript">
    import { selectedAccountIndex } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { IAccountSubject, IAddressSubject, newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { getSubjectFromAddress } from '@core/wallet/utils'
    import { Button, FontWeight, IOption, Text, TextType } from 'shared/components'
    import { onMount } from 'svelte'
    import { RecipientInput } from '../../../../../components'
    import { sendRouter } from '../../../../../lib/routers'
    import { isKeyboardOpen, keyboardHeight } from '../../../../../lib/auxiliary/keyboard'

    let recipient: IAddressSubject | IAccountSubject
    let recipientValidationError: string
    let recipientInputElement: HTMLInputElement

    let recipientQuickListOptions: IOption[] = []
    $: recipientQuickListOptions = $visibleActiveAccounts
        .filter((account) => account.index !== $selectedAccountIndex)
        .map((account) => ({
            id: account.index,
            key: account.name,
            value: account.depositAddress,
        }))

    let filteredQuickListOptions: IOption[] = []
    $: recipient, updateFilteredQuickListOptions()

    onMount(() => {
        recipientInputElement?.focus()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        recipient = $newTransactionDetails?.recipient
    })

    function onContinueClick(): void {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, recipient })
        $sendRouter.next()
    }

    function updateFilteredQuickListOptions(): void {
        const lowerCaseRecipient =
            recipient?.type === 'address' ? recipient?.address?.toLowerCase() : recipient?.account?.name?.toLowerCase()
        filteredQuickListOptions = lowerCaseRecipient
            ? recipientQuickListOptions.filter(
                  (option) =>
                      option?.key?.toLowerCase()?.includes(lowerCaseRecipient) ||
                      option?.value?.toLowerCase()?.includes(lowerCaseRecipient)
              )
            : recipientQuickListOptions
    }

    function handleClick(option: IOption): void {
        recipient = getSubjectFromAddress(option?.value)
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 space-y-4 justify-between">
    <RecipientInput bind:recipient bind:error={recipientValidationError} bind:inputElement={recipientInputElement} />
    <div class="flex flex-col flex-1 space-y-1 overflow-y-auto">
        {#each filteredQuickListOptions as option}
            <button
                on:click={() => handleClick(option)}
                class="w-full flex flex-row w-full justify-between items-center px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
            >
                <div class="flex flex-row gap-3 justify-start items-center" style="max-width: 50%;">
                    <Text
                        type={TextType.p}
                        fontSize="sm"
                        fontWeight={FontWeight.medium}
                        color="gray-800"
                        classes="truncate"
                    >
                        {option.key}
                    </Text>
                </div>
                <Text type={TextType.pre} fontSize="sm" color="gray-600">
                    {truncateString(option.value, 9, 9)}
                </Text>
            </button>
        {/each}
    </div>
    <div style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`}>
        <Button 
            disabled={!!recipientValidationError} 
            outline 
            classes="w-full" 
            onClick={onContinueClick}
        >
            {recipientValidationError ?? localize('actions.continue')}
        </Button>
    </div>
</div>
