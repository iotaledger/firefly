<script lang="ts">
    import { Text } from '@ui'
    export let error: string | null
</script>

{#if error !== null}
    <div class="inline-block w-full h-full mt-1">
        <Text classes="inline-block break-all" error>{error}</Text>
    </div>
{/if}
