<script>
  import {fade} from 'svelte/transition'
  import Icon from './Icon.svelte'

  export let options = [] // {id,label}
  export let selectedId = null
  export let onSelect = (a) => {}

  $: open = false
  $: selected = selectedId && options && options.find(o=> o.id===selectedId)

  function click(){
    open = !open
  }
  function select(s) {
    onSelect(s)
    open = false
  }
</script>

{#if options && options.length && selected && selected.label}

<div class="wrap" on:click={click}>
  <div class="text">
    {selected.label}
  </div>
  {#if open}
    <div class="slide-wrap" transition:fade={{duration:100}}>
      <div class="slide">
        {#each options as op}
          <div class="option" on:click|stopPropagation={()=> select(op)}>
            {op.label}
          </div>
        {/each}
      </div>
    </div>
  {/if}
  <Icon name="drop-down" color="#2e456d" size={30}
    style={{position:'absolute', top:5, right:5}}
  />
</div>

{/if}

<style>
  .wrap{
    width: 100%;
    z-index: 100;
    height:42px;
    border-radius:9px;
    border:2px solid var(--bg-light-color);
    display:flex;
    align-items:center;
    position: relative;
    cursor: pointer;
  }
  .text{
    font-weight:500;
    background: var(--border-color);
    border-radius:9px;
    height:38px;
    width:100%;
    display:flex;
    align-items: center;
    padding:0 12px;
  }
  .slide-wrap{
    height:0px;
    width:100%;
    position:absolute;
    bottom:0;
    width:100%;
    left:0;
  }
  .slide{
    transition: transform 0.1s;
    position:absolute;
    left:0;
    top:5px;
    width:100%;
    background: var(--border-color);
    border-radius:9px;
    border:2px solid var(--bg-light-color);
  }
  .option{
    border-bottom:1px solid var(--bg-light-color);
    cursor: pointer;
    padding:0 12px;
    display: flex;
    align-items: center;
    height:32px;
  }
  .option:last-child{
    border-bottom-width: 0px;
  }
  .option:hover{
    background: var(--bg-light-color);
  }
</style>
  