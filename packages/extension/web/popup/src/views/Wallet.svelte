<script>
  import {onMount} from 'svelte'
  import * as api from '../api'

  onMount(async ()=>{
    const r = await api.get_accounts()
    console.log(r)
  })
</script>

<style>
  p{
    color:white;
  }
</style>

<p>
  wallet
</p>