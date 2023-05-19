<script lang="ts">
    import { getIconColorFromString } from '@core/account/utils'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NftMedia, Text } from '@ui'
    import { FontWeight } from './enums'

    export let profile: IPersistedProfile
    export let size: 'large' | 'medium' | 'small' = 'large'
    export let backgroundColor: string | undefined = undefined

    let height: number
    let width: number
    let fontSize: number
    let lineHeight: string
    $: {
        switch (size) {
            case 'large':
                height = 18
                width = 18
                fontSize = 18
                lineHeight = '160'
                break
            case 'medium':
                height = 10
                width = 10
                fontSize = 13
                lineHeight = '110'
                break
            case 'small':
                height = 8
                width = 8
                fontSize = 11
                lineHeight = '110'
                break
            default:
                break
        }
    }

    $: backgroundColor =
        backgroundColor || getIconColorFromString(profile?.name, { shades: ['500'], colorsToExclude: ['gray'] })
</script>

<profile-picture
    class="rounded-full font-bold text-center flex items-center justify-center
        h-{height} w-{width}
        {backgroundColor ? 'icon-bg' : 'bg-blue-500'}
    "
    style={backgroundColor ? `--icon-bg-color: ${backgroundColor}` : ''}
>
    {#if profile?.pfp}
        <NftMedia nft={profile.pfp} classes="rounded-full object-cover h-{height} w-{width}" />
    {:else if profile?.name}
        <Text {fontSize} {lineHeight} fontWeight={FontWeight.bold} classes="text-white"
            >{getInitials(profile.name, 3)}</Text
        >
    {/if}
</profile-picture>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
