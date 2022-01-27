<script lang="ts">
  import '../../shared/bits/GlobalStyles.svelte'
  import Header from './views/Header.svelte'
  import Transaction from './views/Transaction.svelte'
  import GetAccounts from './views/GetAccounts.svelte'
  import {onMount} from 'svelte'
  import {getParams} from '../../shared/utils'
  import * as commands from './commands'
  import type {Params} from './types'
  import * as api from './api'
  import {profile} from './store'

  let params:Params = {
    id:'', origin:'', cmd: 'Default', title: ''
  }

  async function loadProfile(){
    const p = await api.get_profle()
    if(p && p.payload) profile.set(p.payload)
  }

  onMount(()=>{
    const p = getParams()
    if(p.id) api.init(p.id, p.origin)
    const extras = (p.cmd && commands[p.cmd]) || commands.Error
    params = {...p, ...extras}
    loadProfile()
  })
</script>

<style>
  main{
    background: var(--bg-color);
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 100%;
  }
</style>

<main>
  <Header title={params.title} />

  {#if params.cmd==='SendTransfer'}
    <Transaction amount={params.amount} address={params.address} />
  {/if}

  {#if params.cmd==='GetAccounts'}
    <GetAccounts />
  {/if}
</main>