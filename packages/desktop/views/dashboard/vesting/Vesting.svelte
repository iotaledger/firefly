<script lang="ts">
    import { Pane, Text, TextType } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { VestingTable } from '@components'
</script>

{#if $selectedAccount}
    <vesting-container class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <div class="h-full flex flex-col space-y-4">
                <div class="flex flex-row space-x-4">
                    <Pane classes="flex flex-col p-6 space-y-2 w-1/3">
                        <Text type={TextType.h4} classes="mb-4">Pending vesting amount</Text>
                        <Text type={TextType.h1} classes="mb-4">200 SMR</Text>
                    </Pane>
                    <Pane classes="flex flex-col p-6 space-y-2 w-full">
                        <Text type={TextType.h4} classes="mb-4">
                            Information about what is vesting and how it works
                        </Text>
                        <Text type={TextType.p} classes="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Text>
                    </Pane>
                </div>
                <Pane classes="h-full min-h-96">
                    <VestingTable />
                </Pane>
            </div>
        {/key}
    </vesting-container>
{/if}
