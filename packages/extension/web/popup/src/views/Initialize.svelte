

<script lang="ts">
  import {Button, Halo} from '../../../shared/bits'

  export let onLink = () => {};
</script>

<style>
  section {
    position:absolute;
    bottom:0;
    left:0;
    display:flex;
    align-items: center;
    justify-content: center;
    width:100%;
    height:70px;
  }
</style>

<main>

<Halo initialize={true} />

<section>
  <Button on:click={onLink} color="primary" style={{padding:'0 15px', width:225}}>
    <span>Link Firefly</span>
  </Button>
</section>

</main>