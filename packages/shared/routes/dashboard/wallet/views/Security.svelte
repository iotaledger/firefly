<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let locale
</script>

<div data-label="security" class="p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.security')}</Text>
    <div class="overflow-auto space-y-2">
        <!-- Stronghold -->
        <div data-label="stronghold" class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
            <Icon icon="arrow-down" />
            <div class="flex flex-col ml-4">
                <Text type="p" bold smaller>Stronghold Enabled</Text>
                <Text type="p" error smaller>Backup required</Text>
            </div>
            <div class="flex-1 items-end flex flex-col ml-4">
                <Icon icon="arrow-up" />
            </div>
        </div>
        <!-- Wallet Version -->
        <div data-label="wallet-version" class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
            <Icon icon="arrow-down" />
            <div class="flex flex-col ml-4">
                <Text type="p" bold smaller>Firefly v. 1.32</Text>
                <Text type="p" secondary smaller>Up to-date</Text>
            </div>
            <div class="flex-1 items-end flex flex-col ml-4">
                <Icon icon="arrow-up" />
            </div>
        </div>
        <!-- Hardware Device -->
        <div data-label="hardware-device" class="flex rounded-2xl items-center p-4 border border-solid border-gray-200">
            <Icon icon="arrow-down" />
            <div class="flex flex-col ml-4">
                <Text type="p" bold smaller>Hardware Device</Text>
                <Text type="p" secondary smaller>None detected</Text>
            </div>
            <div class="flex-1 items-end flex flex-col ml-4">
                <Icon icon="arrow-up" />
            </div>
        </div>
    </div>
</div>
