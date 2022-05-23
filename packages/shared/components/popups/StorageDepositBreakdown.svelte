<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { HR, Text } from 'shared/components'
</script>

<div class="flex flex-col space-y-6">
    <Text type="h3" fontWeight={FontWeightText.semibold} lineHeight="24">Storage deposit breakdown</Text>
    <HR overrideColor classes="border-gray-100" />
    <div class="flex justify-between">
        <div class="flex flex-col space-y-0.5">
            <Text fontSize="15" lineHeight="20">Locked in pending transactions</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">
                For sending native assets and small IOTA amounts
            </Text>
        </div>
        <div class="flex flex-col items-end space-y-0.5">
            <Text fontSize="15" lineHeight="20">1.83 Mi</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">$ 2.45</Text>
        </div>
    </div>
    <HR overrideColor classes="border-gray-100" />
    <div class="flex justify-between">
        <div class="flex flex-col space-y-0.5">
            <Text fontSize="15" lineHeight="20">Reserved for Native Tokens</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">
                For storing native tokens
            </Text>
        </div>
        <div class="flex flex-col items-end space-y-0.5">
            <Text fontSize="15" lineHeight="20">1.83 Mi</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">$ 2.45</Text>
        </div>
    </div>
    <HR overrideColor classes="border-gray-100" />
    <div class="flex justify-between">
        <div class="flex flex-col space-y-0.5">
            <Text fontSize="15" lineHeight="20">Reserved for NFTs</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">
                For storing NFTs
            </Text>
        </div>
        <div class="flex flex-col items-end space-y-0.5">
            <Text fontSize="15" lineHeight="20">1.83 Mi</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">$ 2.45</Text>
        </div>
    </div>
    <HR overrideColor classes="border-gray-100" />
    <div class="flex justify-between">
        <Text color="gray-800" fontWeight={FontWeightText.semibold} fontSize="15">Total storage deposit</Text>
        <div class="flex flex-col items-end space-y-0.5">
            <Text fontWeight={FontWeightText.semibold} fontSize="15" lineHeight="20">1.83 Mi</Text>
            <Text color="gray-600" fontWeight={FontWeightText.medium} fontSize="13" lineHeight="16">$ 2.45</Text>
        </div>
    </div>
</div>
