<script lang="ts">
    import { Text } from 'shared/components'
    export let error: string
</script>

<div class="inline-block w-full h-full mt-1">
    <Text classes="inline-block" error>{error}</Text>
</div>
