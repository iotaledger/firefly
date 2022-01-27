<script>
  export let active;
  export let onToggle;

  function click(){
    onToggle(!active)
  }

  $: wrapStyle = `border: 1px solid ${active ? 'var(--primary-color)' : 'grey'};`
  $: ballStyle = `transform: translate(${active ? '12' : '0'}px); background: ${active ? 'var(--primary-color)' : 'grey'};`
</script>

<div class="wrap" on:click={click} style={wrapStyle}>
  <div class="ball" style={ballStyle}></div>
</div>

<style>
  .wrap {
    cursor: pointer;
    width:30px;
    height:18px;
    position:relative;
    border-radius:10px;
  }
  .ball{
    position:absolute;
    left:2px;
    bottom:2px;
    height:12px;
    width:12px;
    border-radius:100%;
    transition:transform 0.13s;
  }
</style>