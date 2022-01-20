<script lang="ts">

  export let color = 'default'
  export let text = ''
  export let disabled = false;
  export let onClick=()=>{}

  function click() {
    if(disabled) return
    onClick()
  }

</script>

{#if text}
  <footer on:click={click} class={color} {disabled}>
    {text}
  </footer>
{/if}

<style>
  footer {
    height: 46px;
    min-height: 46px;
    width: 100%;
    padding: 0 13px;
    position:fixed;
    bottom:0;
    left:0;
    display:flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
    font-weight:500;
    font-size:12px;
    letter-spacing: 1px;
  }
  footer.default {
    background: var(--bg-light-color);
    color: var(--title);
  }
  footer.default:hover {
    background: var(--main-color);
  }
  footer.primary {
    background: var(--primary-color);
  }
  footer.primary:hover {
    background: var(--primary-color-transparent);
    color:white;
  }
  footer[disabled="true"]{
    color:grey;
    pointer-events: none;
    background: var(--primary-color-transparent);
  }
</style>
