
<script>
  export let origin = ''
  export let onClick = (o) => {}
</script>

<style>
  section{
    height: 37px;
    color: var(--subtitle);
    border-top:1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding:0 12px;
    background:var(--main-color);
    cursor: pointer;
  }
  section:hover{
    background:var(--bg-light-color);
  }
  section:last-child{
    border-bottom:1px solid var(--border-color);
  }
  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<section on:click={()=>onClick(origin)}>
  <span>{origin}</span>
</section>