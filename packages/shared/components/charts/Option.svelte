<script>
    import {Box, Text} from 'shared/components'

    export let selected = false
    export let option
</script>

<style type="text/scss">
  p {
    color: var(--text-secondary-color);
    font-size: 10px;
    line-height: 12px;
    cursor: pointer;

    &.selected {
      color: var(--bg-grey-color);
      background: var(--ui-blue-color);
    }
  }
</style>

{#if selected}
    <p  class:selected type="p" class="px-4 flex items-center justify-center rounded-full h-8 w-8">{option}</p>
{:else}
    <p class="px-4 py-2">{option}</p>
{/if}
