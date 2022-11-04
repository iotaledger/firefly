<script lang="typescript">
    import { localize } from '@core/i18n'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Button } from 'shared/components'
    import { onMount } from 'svelte'
    import { RecipientInput } from '../../../../../components'
    import { sendRouter } from '../../../../../lib/routers'
    import { IAddressSubject } from '@core/wallet'

    let recipient: IAddressSubject
    let recipientValidationError: string

    onMount(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        recipient = $newTransactionDetails?.subject
    })

    function onContinueClick(): void {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, subject: recipient })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <RecipientInput bind:recipient bind:error={recipientValidationError} />
    <Button disabled={!!recipientValidationError} outline classes="w-full" onClick={onContinueClick}>
        {recipientValidationError ?? localize('actions.continue')}
    </Button>
</div>
