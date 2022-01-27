<script>
  export let style = {};
  export let render = false;

  import { fade } from 'svelte/transition';
  import {css} from '../../../shared/bits/utils'
</script>

{#if render}
  <main style={css(style)} transition:fade="{{ duration:100 }}">
    <slot />
  </main>
{/if}

<style>
  main{
    background: var(--bg-color);
    margin: 4px 20px 4px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
  }
</style>