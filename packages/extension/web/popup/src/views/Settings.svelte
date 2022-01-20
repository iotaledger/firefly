<script lang="ts">
  import Footer from './Footer.svelte'
  import * as api from '../api'
  import { page, origins } from '../store';
  import {aclToPerms} from '../utils/perms'
  import { displayOrigin } from "../../../shared/utils";
  import {Toggle} from '../../../shared/bits'

  export let origin = ''

  async function removeOrigin(){
    const res = await api.remove_origin(origin)
    if(res) {
      page.set('manage')
    }
  }

  $: existing = $origins.find(d=>d.origin===origin)

  async function onToggle(name){
    existing.acl[name] = !existing.acl[name]
    await api.update_origin(existing)
  }
</script>

{#if existing}

  <div class="img-wrap">
    <img src={existing.fav} alt="favicon" />
  </div>
  <p>{displayOrigin(origin)}</p>

  {#each aclToPerms(existing.acl) as perm, i}
    <div class="perm">
      <span>{perm.text}</span>
      <Toggle onToggle={()=> onToggle(perm.name)} active={perm.active} />
    </div>
  {/each}

  <Footer color="primary" onClick={removeOrigin} 
    text="Remove Site"
  />

{/if}

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
</style>