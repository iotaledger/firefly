<script lang="ts">
  import {Button,Dropdown} from '../../../shared/bits'
  import type {Tx} from '../../../shared/types'
  import * as api from '../api'
  import {profile} from '../store'

  export let amount = ''
  export let address = ''

  $: selectedAccountId = ($profile && $profile.accounts && $profile.accounts.length) ?
    $profile.accounts[0].id : null
    
  function selectAccount(a) {
    selectedAccountId = a.id
  }
  $: options = $profile && $profile.accounts && $profile.accounts.map(a=>{
    return ({id: a.id, label: `${a.alias} • ${a.balance}`})
  })

  function cancel(){
    api.cancel()
  }
  function send() {
    api.send_transfer(selectedAccountId, <Tx>{
      address, amount: parseInt(amount)
    })
  }
</script>

<style>
  main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width:100%;
    height:100%;
    flex:1;
    position: relative;
  }
  .tx{
    margin-bottom:84px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color:white;
    max-width: 100%;
  }
  .buttons{
    position: absolute;
    bottom:42px;
    padding:0 13px;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .amount{
    font-weight: bold;
    font-size:15px;
    display:flex;
    align-items: center;
    margin-bottom:15px;
  }
  .amount > span:first-child{
    margin-right:9px;
    font-size:20px;
  }
  .amount > span:last-child{
    color: var(--subtitle);
  }
  .address{
    font-size:15px;
    max-width: 90%;
    background: var(--subtitle);
    padding: 6px 8px;
    border-radius: 6px;
    color: black;
    word-wrap: break-word;
  }
  .dropdown-wrap{
    max-width: 90%;
    width:90%;
  }
</style>

<main>
  <section class="tx">

    <div class="amount">
      <span>{amount}</span>
      <span>IOTA</span>
    </div>

    <div class="dropdown-wrap">
      <Dropdown options={options}
        onSelect={selectAccount}
        selectedId={selectedAccountId}
      />
    </div>

    <p class="address">{address}</p>

  </section>
  <section class="buttons">
    <Button color="cancel" on:click={cancel} style={{fontSize:12,flex:1}}>CANCEL</Button>
    <Button disabled={!selectedAccountId} on:click={send} style={{fontSize:12,marginLeft:10,flex:1}}>CONFIRM</Button>
  </section>
</main>
