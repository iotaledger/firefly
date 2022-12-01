<script lang="typescript">
    import { Pane, Text, TextType } from '@ui'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
</script>

{#if $selectedAccount}
    <div
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <Pane classes="w-full h-full p-6">
                <Text type={TextType.h1}>{localize('tabs.governance')}</Text>
            </Pane>
        {/key}
    </div>
{/if}
