<script lang="ts">
  import {onMount} from 'svelte'
  import Header from './views/Header.svelte'
  import Content from './views/Content.svelte'
  import '../../shared/bits/GlobalStyles.svelte'
  import * as api from './api'
  import {origins} from './store'

  onMount(async()=>{
    const r:any = await api.get_origins()
    if(r && r.payload && r.payload.length) {
      origins.set(r.payload)
    }
  })

</script>

<main>
  <Header />

  <Content />

  <!-- <Footer /> -->
</main>

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
