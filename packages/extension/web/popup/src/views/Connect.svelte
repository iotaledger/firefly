<script lang="ts">
  import {Toggle} from '../../../shared/bits'
  import {onMount} from 'svelte'
  import { checkUrlOK, currentTab, displayOrigin } from "../../../shared/utils";
  import Footer from './Footer.svelte'
  import * as api from '../api'
  import { page } from '../store';
  import {initialPerms,permsToACL} from '../utils/perms'
  
  const perms = [...initialPerms]
  function onToggle(i){
    perms[i].active = !perms[i].active
  }
  $: atLeastOneActive = perms.find(p=> p.active) ? true : false

  let origin = ''
  let fav = ''
  let error = ''

  function setErr() {
    error = 'Cannot connect to this site'
  }
  async function setOrigin() {
    const tab = await currentTab();
    if (!(tab && tab.url)) return setErr();
    if (!checkUrlOK(tab.url)) return setErr();
    origin = new URL(tab.url).origin;
    fav = tab.favIconUrl
  }

  onMount(setOrigin);

  async function connect() {
    console.log('=> connect!')
    if(!atLeastOneActive) return 
    const acl = permsToACL(perms)
    const res = await api.add_origin({origin, acl, fav})
    if(res) {
      page.set('origin')
    }
  }
</script>

{#if fav}
  <div class="img-wrap">
    <img src={fav} alt="favicon" />
  </div>
{/if}
{#if origin}
  <p>{displayOrigin(origin)}</p>
{/if}

{#if error}
  <div class="error">
    {error}
  </div>
{:else}

  {#each perms as perm, i}
    <div class="perm">
      <span>{perm.text}</span>
      <Toggle onToggle={()=> onToggle(i)} active={perm.active} />
    </div>
  {/each}

{/if}

<Footer color="primary" onClick={connect} 
  text="Connect site" disabled={!atLeastOneActive}
/>

<style>
  .perm{
    display:flex;
    justify-content: space-between;
    align-items: center;
    width:100%;
    color:var(--title);
    margin:5px 0;
    font-size:14px;
  }
  .img-wrap{
    border-radius:100%;
    width:42px;
    height:42px;
    /* background:white; */
    display:flex;
    align-items: center;
    justify-content: center;
    margin-top:30px;
  }
  img {
    height:32px;
    width:32px;
  }
  p {
    margin:20px 0;
  }
  .error {
    color: var(--delete-color);
    font-weight: 500;
    margin-top:20px;
    font-size:14px;
  }
</style>