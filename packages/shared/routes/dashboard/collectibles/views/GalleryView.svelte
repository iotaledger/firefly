<script lang="typescript">
    import { Text, Button } from 'shared/components'
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
<Button {onClick}>Details</Button>
<Button onClick={onClick2}>Collection</Button>
