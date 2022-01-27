<script lang="ts">
  import {css} from './utils'

  export let style:{[k:string]:any} = {}
  export let color: "primary" | "outlined" | "accent" | "cancel" | "delete";
  export let disabled = false;
</script>

<style>
  button.primary {
    background: var(--primary-color);
    border: 2px solid var(--primary-color);
    color: white;
    box-shadow: 0px 0px 23px 5px var(--primary-color-transparent);
  }
  button.outlined {
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
  }
  button.accent {
    border: 2px solid var(--accent-color);
    color: var(--accent-color);
  }
  button.cancel {
    border: 2px solid var(--cancel-color);
    color: var(--cancel-color);
  }
  button.delete {
    border: 2px solid var(--delete-color);
    color: var(--delete-color);
  }
  button {
    font-size:12px;
    font-family:'Inter', sans-serif;
    font-weight: 300;
    padding: 0 20px;
    height: 37px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    cursor: pointer;
    border-radius: 6px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  button[disabled] {
    cursor:default;
    border: 2px solid grey;
    color: grey;
    background:transparent;
  }
  button:focus {
    outline: 0;
  }
  button:active {
    outline: 0;
  }
  button:hover:enabled {
    background-color: rgba(255, 255, 255, 0.08);
  }
  button.primary:hover:enabled {
    box-shadow: 0px 0px 15px 7px var(--primary-color-transparent);
    color: var(--primary-color);
  }
</style>

<button on:click class={color || 'primary'} style={css(style)} disabled={disabled}>
  <slot />
</button>
