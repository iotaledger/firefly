<script lang="ts">
    import { Text } from 'shared/components'
    export let error: string | null
</script>

{#if error !== null}
    <div class="inline-block w-full h-full mt-1">
        <Text classes="inline-block" error>{error}</Text>
    </div>
{/if}
