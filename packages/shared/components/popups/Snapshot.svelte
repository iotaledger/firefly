<script lang="typescript">
    import { Text } from 'shared/components'

    export let locale
</script>

<Text type="h4" classes="mb-5">{locale('popups.snapshot.title')}</Text>
<Text type="p" secondary>{locale('popups.snapshot.body')}</Text>
