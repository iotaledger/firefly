<script lang="ts">
  import Button from "../../../shared/bits/Button.svelte";
  import * as api from "../api";

  function cancel() {
    api.cancel();
  }
  function getAccounts() {
    api.get_accounts();
  }
</script>

<main>
  <section class="tx">
    
  </section>
  <section class="buttons">
    <Button color="cancel" on:click={cancel} style={{ fontSize: 12 }}
      >CANCEL</Button
    >
    <Button on:click={getAccounts} style={{ fontSize: 12 }}>READ ACCOUNTS</Button>
  </section>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  }
  .tx {
    margin-bottom: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
  }
  .buttons {
    position: absolute;
    bottom: 42px;
    padding: 0 24px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .amount {
    font-weight: bold;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
  .amount > span:first-child {
    margin-right: 9px;
    font-size: 20px;
  }
  .amount > span:last-child {
    color: var(--subtitle);
  }
  .address {
    font-size: 15px;
    max-width: 84%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: var(--subtitle);
    padding: 4px 8px;
    border-radius: 8px;
    color: black;
  }
</style>
