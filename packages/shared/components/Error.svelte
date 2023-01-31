<script lang="ts">
    import { Text } from 'shared/components'
    export let error = ''
</script>

{#if error !== null}
    <div class="inline-block h-5 w-full mt-1">
        <Text type="p" classes="inline-block" error>{error}</Text>
    </div>
{/if}
