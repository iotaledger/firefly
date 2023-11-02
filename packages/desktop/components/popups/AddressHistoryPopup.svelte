<script lang="ts">
    import { localize } from '@core/i18n'
    import { CopyableBox, FontWeight, Spinner, Text, TextType } from 'shared/components'
    import { getSelectedAccount } from '@core/account'
    import { truncateString } from '@core/utils'
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('Address History')}
    </Text>

    {#await getSelectedAccount()?.addresses()}
        <div class="flex">
            <Spinner message="Loading addresses..." />
        </div>
    {:then addresses}
        {#if addresses && addresses?.length > 0}
            <div class="flex flex-col">
                {#each addresses as address}
                    <CopyableBox col value={address.address} classes="mb-2">
                        <div class="flex items-center justify-center">
                            <Text type={TextType.h4} secondary classes="mr-3">
                                {address.keyIndex}:
                            </Text>
                            <Text type={TextType.h5} smaller>
                                {truncateString(address.address, 16, 16)}
                            </Text>
                        </div>
                    </CopyableBox>
                {/each}
            </div>
        {:else}
            <div>No addresses</div>
        {/if}
    {/await}
</div>
