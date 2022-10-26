<script lang="typescript">
    import { newTransactionDetails } from '@core/wallet'
    import { get } from 'svelte/store'
    import { RecipientInput } from '../../../../../../../mobile/components'

    const { recipient } = get(newTransactionDetails)
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <RecipientInput {recipient} />
</div>
