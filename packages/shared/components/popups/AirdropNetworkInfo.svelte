<script lang="typescript">
    import { Illustration, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import type { StakingAirdrop } from 'shared/lib/participation/types'

    export let airdrop: StakingAirdrop
</script>

<div class="mb-5 text-center">
    <Text type="h4">{localize(`popups.${airdrop}-info.title`)}</Text>
</div>
<Illustration illustration="{airdrop}-info-bg" classes="relative w-full rounded-2xl mb-7" />
<div class="flex flex-col flex-wrap space-y-3">
    <Text type="p">{localize(`popups.${airdrop}-info.body1`)}</Text>
    <Text type="p">{localize(`popups.${airdrop}-info.body2`)}</Text>
</div>
