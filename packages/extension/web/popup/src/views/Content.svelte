<script lang="ts">
  import {onMount} from 'svelte'
  import Card from './Card.svelte'
  // import Wallet from './Wallet.svelte'
  import type {Response} from '../../../shared/types'
  import * as api from '../api'
  import {sleep} from '../utils/funcs'
  import { fade } from 'svelte/transition';
  import {currentTab} from '../../../shared/platform'
  import Initialize from './Initialize.svelte'
  import Connect from './Connect.svelte'
  import Origin from './Origin.svelte'
  import { page } from '../store';
  import Manage from './Manage.svelte'
  import Settings from './Settings.svelte'

  let emojis = ''
  let currentOrigin = ''

  async function checkLink() {
    try {
      const r:Response = await api.check_link()
      if(r.type==='CalledGlow') {
        if(r.payload && r.payload==="INITIALIZED") {
          page.set('wallet')
          return true
        } else {
          page.set('link')
        }
      }
    } catch(e) {
      // page.set('origin') // comment out
      // console.log("COULDNT CHECK LINK",e)
    }
  }

  onMount( async()=> {
    const tab = await currentTab()
    if(tab && tab.url) {
      currentOrigin = new URL(tab.url).origin
    }
    checkLink()
  })

  async function checkLinkAfterLink() {
    let done = false
    let i = 0
    while (!done) {
      const isLinked = await checkLink()
      if(isLinked || i > 100) done = true
      i ++
      await sleep(250)
    }
  }

  async function link() {
    // window.open(
    //   'iota://atoi1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/?plugin=glow',
    // );
    try {
      const r = await api.link_profile()
      console.log(r)
      if(r.type==='LinkedProfile') {
        const ems = r.payload.payload
        emojis = ems
        page.set('link')
        checkLinkAfterLink()
      }
    } catch(e) {
      console.log("COULDNT LINK",e)
    }
  }
  
  $: route = $page.includes('?') ? $page.split('?')[0] : $page
  $: param = $page.includes('?') && $page.includes('=') ? $page.split('?')[1].split('=')[1] : null
  $: console.log('route:',route,$page)
</script>

<Card render={$page?true:false} style={$page==='init'?{justifyContent:'center'}:{}}>

  {#if route==='init'}
    <Initialize onLink={link} />
  {:else if route==='connect'}
    <Connect />
  {:else if route==='manage'}
    <Manage />
  {:else if route==='settings'}
    <Settings origin={param} />
  {:else if route==='link'}
    <p>Verify the following emoji sequence in your wallet:</p>
    <div class="emojis" transition:fade="{{ duration:100 }}">
      {emojis}
    </div>
  {:else if route}
    <Origin />
  {/if}

</Card>

<style>
  p {
    color:var(--title);
    margin: 0 0 18px 0;
    max-width: 160px;
    text-align: center;
    font-size: 13px;
  }
  .emojis {
    font-size:28px;
    letter-spacing: 12px;
    text-align: center;
    background: white;
    border-radius: 10px;
    padding-left: 14px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 28px;
    padding-top: 6px;
    transition: 0.3s;
  }
  .emojis.small {
    transform: scale(0.7) translateY(158px);
  }
</style>