<script lang="ts">
  import Button from "../../../../shared/bits/Button.svelte";
  import * as api from '../../api'
  import { cubicOut } from 'svelte/easing';
  import {origins} from '../../store'

  export let origin = ''
  export let onClose = () => {}

  $: existing = $origins.find(d=>d.origin===origin)

  async function addThisOrigin(){
    const res = await api.add_origin({origin:''})
    console.log("RES",res)
    onClose()
  }

  async function removeThisOrigin(){
    const res = await api.remove_origin(origin)
    console.log("REMOVE RES",res)
    onClose()
  }
  
  function modal(node, {
    delay = 0, duration = 100
  }) {
    return {
      delay, duration,
      css: t => {
        const eased = cubicOut(t);
        return `transform: scale(${eased});`;
      }
    };
  }

</script>

<style>
  section {
    position: fixed;
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    top: 12px; left:12px;
    background: var(--main-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 0px 10px 0px #00000066;
    transform-origin: center center;
    transition: transform 0.2s;
  }
  p {
    color:white;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top:20px;
    font-size:20px;
  }
  .close-wrap{
    position:absolute;
    right: 12px;
    top: 12px;
  }
  .button-wrap{
    position:absolute;
    bottom:32px;
    display:flex;
    align-items: center;
    justify-content: center;
    width:100%;
  }
  h5 {
    color:var(--subtitle);
    margin-top:18px;
  }
  .permissions-wrap{
    padding:24px;
    display:flex;
    color:var(--subtitle);
  }
  .permissions-wrap span{
    margin-left:8px;
  }
</style>

<!-- <section in:modal={{ duration: 100 }}>
  <div class="close-wrap">
    <Icon name="plus" size={24} on:click={onClose} 
      transform="rotate(135deg)"  
    />
  </div> -->
  <h5>{existing?'DOMAIN DETAILS':'ADD NEW DOMAIN'}</h5>
  <p>{origin}</p>

  <div class="permissions-wrap">
    <input type="checkbox" disabled checked>
    <span>View the addresses of your permitted account (required)</span>
  </div>

  {#if !existing}
    <div class="button-wrap">
      <Button on:click={addThisOrigin}>Add Domain</Button>
    </div>
  {/if}

  {#if existing}
    <div class="button-wrap">
      <Button on:click={removeThisOrigin} color="delete">Remove Domain</Button>
    </div>
  {/if}
<!-- </section> -->
