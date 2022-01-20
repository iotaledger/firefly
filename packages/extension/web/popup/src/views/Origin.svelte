<script lang="ts">
  import {onMount} from 'svelte'
  import { checkUrlOK, currentTab, displayOrigin } from "../../../shared/utils";
  import {Halo, Button} from "../../../shared/bits"
  import {page, origins} from '../store'
  import Footer from './Footer.svelte'

  let origin = ''
  $: enabled = false

  function setErr(){
    enabled = false
  }
  async function setOrigin() {
    const tab = await currentTab();
    if (!(tab && tab.url)) return setErr();
    if (!checkUrlOK(tab.url)) return setErr();
    origin = new URL(tab.url).origin;
    enabled = true
  }

  onMount(setOrigin);

  $: existing = $origins.find(d=>d.origin===origin)
  $: text = existing ? 'Connected to' : 'Not connected to'

  function connectOrigin() {
    console.log('=> ', origin)
    page.set('connect')
  }
  function goToManage() {
    page.set('manage')
  }
</script>

<Halo />

<div class="content">

  {#if enabled}
    <p>
      <span>{text}</span>
      <b>{displayOrigin(origin)}</b>
    </p>
  {/if}

  {#if !existing}
    <Button on:click={connectOrigin} color="primary" 
      style={{borderRadius:15, height:29}}
      disabled={!enabled}>
      Connect
    </Button>
  {/if}

</div>

<Footer onClick={goToManage} text="Manage Connected Sites" />

<style>
  .content {
    width:100%;
    margin-top:175px;
    position: relative;
    z-index:100;
    display:flex;
    flex-direction: column;
    align-items: center;
  }
  p {
    color: var(--title);
    width:100%;
    text-align: center;
    margin-bottom:18px;
    font-size:12px;
    margin-top:-8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 30px;
  }
</style>
