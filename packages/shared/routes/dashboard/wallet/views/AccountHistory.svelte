<script lang="typescript">
    import { ActivityRow, Text } from 'shared/components'

    export let locale
    export let transactions = []
    export let color = 'blue'
</script>

<div class="h-full p-8 flex flex-col flex-auto flex-grow flex-shrink-0">
    <Text type="h4" classes="mb-5">{locale('general.transactions')}</Text>
    <div class="overflow-y-auto flex-auto h-1 space-y-2">
        {#each transactions as transaction}
            <ActivityRow {...transaction} {color} />
        {/each}
    </div>
</div>
