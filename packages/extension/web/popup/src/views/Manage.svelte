<script lang="ts">
  import {origins, page} from '../store'
  import { displayOrigin } from "../../../shared/utils";
  import {Icon} from "../../../shared/bits";

  function permToText(p:string){
    return {
      'readAddresses': 'Read Addresses',
      'readBalance': 'Read Balance',
      'transact': 'Transact'
    }[p]
  }
  function activePerms(incoming){
    const acl = incoming || []
    if(Object.keys(acl).filter(name=>acl[name]).length===3) {
      return ['Full Permissions']
    }
    const perms = []
    Object.keys(acl).forEach(name=>{
      if(acl[name]) perms.push(permToText(name))
    })
    return perms
  }

</script>

<style>
  .origin-listing{
    height:50px;
    width:100%;
    border-radius:9px;
    border:1px solid var(--bg-light-color);
    margin-bottom:8px;
    display:flex;
    align-items: center;
    padding:0 10px;
    background: var(--border-color);
    position: relative;
  }
  img {
    margin-right:10px;
    height:24px;
    width:24px;
  }
  .origin-texts{
    max-width: calc(100% - 24px);
  }
  .origin-name{
    width:100%;
    margin-bottom:4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .acl {
    display:flex;
  }
  .perm{
    font-size:8px;
    border-radius:10px;
    height: 17px;
    padding: 3px 6px;
    border:1px solid var(--bg-light-color);
    background: var(--bg-light-color);
    margin-right:3px;
  }
</style>

{#each $origins as origin}
  <div class="origin-listing">
    <img src={origin.fav} alt="favicon" />
    <div class="origin-texts">
      <div class="origin-name">{displayOrigin(origin.origin)}</div>
      <div class="acl">
        {#each activePerms(origin.acl) as perm}
          <div class="perm">{perm}</div>
        {/each}
      </div>
    </div>
    <Icon style={{position:'absolute',right:5,top:14}} 
      name="chevron-right" color="#78b0e2" size={20}
      on:click={()=> page.set(`settings?origin=${origin.origin}`)}
    />
  </div>
{/each}
