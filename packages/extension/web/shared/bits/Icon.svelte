<script lang="ts">
  import {css} from '../../shared/bits/utils'

  type Name = 'plus' | 'arrow-back' | 'burger' | 'chevron-right' | 'drop-down'

  export let name:Name = 'plus'
  export let size:number = 24
  export let color:string = 'white'
  export let style:{[k:string]:any} = {}

  interface Shape {
    d?:string
    fill?:string
    type?:string
    points?:string
  }
  const names:{[k:string]:Shape[]} = {
    'plus': [
      {d:"M0 0h24v24H0z", fill:'none'},
      {fill:color, d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"},
    ],
    'arrow-back': [
      {d:'M0 0h24v24H0z', fill:'none'},
      {fill:color, d:'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'}
    ],
    'burger': [
      {d:'M0 0h24v24H0z', fill:'none'},
      {fill:color, d:'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'}
    ],
    'chevron-right': [
      {d:'M0 0h24v24H0z', fill:'none'},
      {type:'polygon', points:'6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12', fill:color}
    ],
    'drop-down': [
      {d:'M0 0h24v24H0z', fill:'none'},
      {fill:color, d:'M7 10l5 5 5-5z'}
    ]
  };

  const paths = names[name] || []

  const theStyle = style
  if(!theStyle.cursor) theStyle.cursor='pointer'
</script>

<svg on:click style={css(style)} height={size} width={size} viewBox="0 0 24 24" fill="none">
  {#each paths as path}
    {#if path.type==='polygon'}
      <polygon points={path.points} fill={path.fill || 'none'} />
    {:else}
      <path d={path.d} fill={path.fill||'none'} />
    {/if}
  {/each}
</svg>

<style>
  svg{
    transition:transform 0.2s;
    z-index: 99;
  }
</style>