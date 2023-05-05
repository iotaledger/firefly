<script lang="ts">
    import { getIconColorFromString } from '@core/account/utils'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NftMedia, Text, TextType } from '@ui'

    export let profile: IPersistedProfile
    export let size = 18
    export let backgroundColor: string

    $: backgroundColor = backgroundColor || getIconColorFromString(profile?.name)
</script>

<profile-picture
    class="rounded-full font-bold text-center flex items-center justify-center
        h-{size} w-{size}
        {backgroundColor ? 'icon-bg' : 'bg-blue-500'}
    "
    style={backgroundColor ? `--icon-bg-color: ${backgroundColor}` : ''}
>
    {#if profile?.pfp}
        <NftMedia nft={profile?.pfp} classes="rounded-full object-cover h-{size} w-{size}" />
    {:else if profile?.name}
        <Text type={TextType.h3} classes="text-white">{getInitials(profile.name, 3)}</Text>
    {/if}
</profile-picture>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
