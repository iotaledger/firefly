<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { drawerOpen } from "../../store";
  import Icon from "../../../../shared/bits/Icon.svelte";
  import { checkUrlOK, currentTab } from "../../../../shared/utils";
  import { origins } from "../../store";
  import Origin from "./Origin.svelte";
  import OriginDetails from "./OriginDetails.svelte";

  let showOriginModal = false;
  let origin = "";

  async function setOrigin() {
    const tab = await currentTab();
    if (!(tab && tab.url)) return;
    if (!checkUrlOK(tab.url)) return;
    origin = new URL(tab.url).origin;
  }

  onMount(setOrigin);

  function openNewOrigin() {
    if (!origin) return;
    showOriginModal = !showOriginModal;
  }
  function clickExisting(o) {
    origin = o;
    showOriginModal = true;
  }
  function closeOriginDetails() {
    showOriginModal = false;
    setOrigin();
  }
  function close() {
    drawerOpen.set(false)
  }
</script>

<style>
  main {
    background: var(--bg-color);
    position: absolute;
    left: 0px;
    top: 0px;
    min-height: 100%;
    width: 211px;
    box-shadow: 1px 1px 10px 0px #00000066;
    z-index: 1000;
  }
  aside {
    position: absolute;
    left: 0px; top: 0px; right:0px; bottom:0px;
    z-index: 999;
  }
  header {
    height: 42px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    color: white;
    background: rgba(0, 0, 0, 0.2);
  }
</style>

<aside on:click={close} />
<main transition:fly={{ x: -300, duration: 150 }}>
  <header>
    <Icon on:click={close} name="arrow-back" />
    <h5>DOMAINS</h5>
    {#if origin}
      <Icon
        name="plus"
        size={22}
        on:click={openNewOrigin}
        transform={showOriginModal ? 'rotate(135deg)' : ''} />
    {:else}
      <div style="width:22px;height:1px;" />
    {/if}
  </header>

  {#if showOriginModal}
    <OriginDetails onClose={closeOriginDetails} {origin} />
  {/if}

  {#each $origins as origin}
    <Origin origin={origin.origin} onClick={clickExisting} />
  {/each}
</main>
