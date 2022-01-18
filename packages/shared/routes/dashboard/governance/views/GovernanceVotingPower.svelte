<script lang="typescript">
    import { Text, Icon } from 'shared/components'

    export let votingPower = 4528125
</script>

<div class='flex justify-between'>
    <Text type="p" classes="ml-2.5 mr-5 text-gray-700 mb-5" overrideColor smaller>My voting power</Text>
    <Icon icon="info" classes="flex-shrink-0 mx-4 text-gray-500 dark:text-white" />
</div>
<Text type="h1" classes="ml-2.5 mr-5 text-gray-800" overrideColor>{votingPower}</Text>
