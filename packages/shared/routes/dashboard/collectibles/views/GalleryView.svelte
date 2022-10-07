<script lang="typescript">
    import { Button, Text, TextType } from 'shared/components'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'

    function onClick() {
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<Text type={TextType.h3}>Collectibles</Text>
<Button {onClick}>Details</Button>
