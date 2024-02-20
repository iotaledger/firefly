<script lang="ts">
    import { localize } from '@core/i18n'
    import { KeyListRow, Text, TextType, FontWeight } from '@ui'

    export let keys: string[] = []
</script>

<manage-keys-popup class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.manageKeys.title')}
    </Text>
    <manage-keys-container class="flex flex-col h-full justify-between space-y-4 py-4">
        {#each keys as key}
            <KeyListRow {key} />
        {/each}
    </manage-keys-container>
</manage-keys-popup>
