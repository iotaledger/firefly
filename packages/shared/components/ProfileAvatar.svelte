<script lang="ts">
    import { getIconColorFromString } from '@core/account/utils'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NftMedia, Text, FontWeight, Size } from '@ui'

    export let profile: IPersistedProfile
    export let size: Size.Large | Size.Medium | Size.Small = Size.Large
    export let backgroundColor: string = getIconColorFromString(profile?.name, {
        shades: ['500'],
        colorsToExclude: ['gray'],
    })

    let lineHeight: string
    let fontSize: number

    $: lineHeight = LINE_HEIGHTS[size]
    $: fontSize = FONT_SIZES[size]

    const FONT_SIZES: { [key in Size]: number } = {
        [Size.Large]: 18,
        [Size.Medium]: 13,
        [Size.Small]: 11,
    }

    const LINE_HEIGHTS: { [key in Size]: string } = {
        [Size.Large]: '160',
        [Size.Medium]: '110',
        [Size.Small]: '110',
    }
</script>

<profile-avatar
    class="rounded-full font-bold text-center flex items-center justify-center icon-bg overflow-hidden {size}"
    style:--icon-bg-color={backgroundColor}
>
    {#if profile?.pfp}
        <nft-wrapper>
            <NftMedia nft={profile.pfp} classes="w-full h-full rounded-full object-cover" />
        </nft-wrapper>
    {:else if profile?.name}
        <Text {fontSize} {lineHeight} fontWeight={FontWeight.bold} classes="text-white">
            {getInitials(profile.name, 3)}
        </Text>
    {/if}
</profile-avatar>

<style lang="scss">
    profile-avatar {
        background-color: var(--icon-bg-color);
        &.small,
        &.small nft-wrapper {
            @apply h-8 w-8;
        }
        &.medium,
        &.medium nft-wrapper {
            @apply h-10 w-10;
        }
        &.large,
        &.large nft-wrapper {
            @apply h-18 w-18;
        }
    }
</style>
