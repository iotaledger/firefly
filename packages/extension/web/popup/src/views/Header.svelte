<script lang="ts">
  import GlowTitle from '../../../shared/bits/GlowTitle.svelte'
  import {Icon} from '../../../shared/bits'
  import {page} from '../store'

  $: route = $page.includes('?') ? $page.split('?')[0] : $page

  // go back 
  const backs = {
    'connect': 'origin',
    'manage': 'origin',
    'settings': 'manage'
  }
  $: back = backs[route]
</script>

<header>

  {#if (back || back==='')}
    <Icon name="arrow-back" on:click={()=> {
      page.set(back)
    }}/>
  {:else}
    <div style="width:32px;"></div>
  {/if}

  <div class="title-wrap">
    <GlowTitle />
  </div>

  <div class="logo" />
</header>

<style>
  header{
    height: 46px;
    min-height: 46px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
    position:relative;
  }
  .title-wrap{
    position:absolute;
    width:calc(100% - 26px);
    text-align:center;
    top:10px;
    z-index: 1;
  }
  .logo{
    background:url("img/icon-light.svg");
    height:28px;
    width:28px;
    background-position: center;
    background-repeat: no-repeat;
    background-size:cover;
    margin-top:1px;
  }
</style>
