<script lang="ts">
    import SendRouter from './SendRouter.svelte'

    import { DrawerId, updateDrawerProps } from '@/auxiliary/drawer'
    import { sendRoute, SendRoute } from '@/routers'

    let allowBack: boolean

    $: $sendRoute, setAllowBack()
    $: allowBack, updateDrawer()

    function updateDrawer(): void {
        updateDrawerProps(DrawerId.Send, {
            allowBack,
        })
    }
    function setAllowBack(): void {
        switch ($sendRoute) {
            case SendRoute.Token:
                allowBack = false
                break
            default:
                allowBack = true
                break
        }
    }
</script>

<SendRouter />
