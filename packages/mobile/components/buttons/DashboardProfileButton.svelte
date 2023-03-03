<script lang="ts">
    import { activeProfile } from '@core/profile'
    import { getInitials } from '@core/utils'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'

    $: profileInitial = getInitials($activeProfile?.name, 1)

    function onClick(): void {
        openDrawer(DrawerId.Profile, { fullScreen: true, enterFromSide: true, allowBack: true })
    }
</script>

<button
    type="button"
    on:click={onClick}
    class="w-10 h-10 relative flex items-center justify-center rounded-full bg-blue-500 leading-100"
>
    <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
</button>
