<script lang="typescript">
    import { Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'

    function onClick() {
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }

    function onClick2() {
        $collectiblesRouter.goTo(CollectiblesRoute.Collection)
    }
</script>

<Text type={TextType.h3}>Collectibles</Text>
<div class="w-12 h-12 bg-black" on:click={onClick}>Details</div>
<div class="w-12 h-12 bg-black" on:click={onClick2}>Collection</div>
