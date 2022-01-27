
<script lang="ts">
  export let initialize:boolean = false;

  const radius = initialize ? 24 : 15
  const anim = `${radius-1};${radius};${radius-1}`
  const strokeWidth = initialize ? 9 : 6
  const top = initialize ? 32 : 0
  const starz = [
    {x:18, y:18, r:0.5},
    {x:25, y:25, r:0.25},
    {x:76, y:21, r:0.35},
    {x:78, y:78, r:0.5},
    {x:67, y:84, r:0.35},
    {x:18, y:77, r:0.5},
  ]
</script>

<style>
  main {
    position: absolute;
    left: 0;
  }
  svg {
    fill:white;
    height:266px;
    width:266px;
    position: relative;
  }
  span {
    color:white;
    position:absolute;
    top:113px;
    font-size:10px;
    font-weight: 300;
    letter-spacing: 1px;
    width:100%;
    text-align: center;
    color:#ccc;
  }
</style>

<main style={`top:${top}px;`}>

{#if initialize}
  <span>
    initialize
  </span>
{/if}

<svg viewBox="0 0 100 100">
  <defs>
    <filter id="f2" x="-100%" y="-100%" width="300%" height="300%">
      <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="9" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs>
  <circle filter="url(#f2)" cx="50" cy="44" r={radius} stroke-width={strokeWidth} fill="none" stroke="white">
    <animate attributeName="r" values={anim} dur="12.5s" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.88;1" dur="3.5s" begin="0s" repeatCount="indefinite"/>
  </circle>

  {#if initialize}
    {#each starz as star}
      <circle cx={star.x} cy={star.y} r={star.r} fill="white" />
    {/each}
  {/if}
</svg>

</main>