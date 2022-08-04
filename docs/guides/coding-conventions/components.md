---
icon: paintbrush
---

# Components

## Organization

The organization of a Svelte component **must** start with the script, followed by the markup and the style.

**Bad**

```typescript
<script></script>

<style></style>

<Component></Component>
```

**Good**

```typescript
<script></script>

<Component></Component>

<style></style>
```

## Reactivity

At the heart of Svelte is a powerful system of reactivity for keeping the DOM in sync with the application state — for example, in response to an event. This section describes our approach to  throughout the codebase. Reactive stores (a language feature) assign a store value (app state) to a local variable, and thanks to Svelte reactivity all the markup and reactive dependencies are updated in **Svelte Components**.

It's not enforced, since regular typescript handles store variables differently. However, the following approach is preferred in Svelte components. Feel free to test the code on the [Svelte Playground](https://svelte.dev/tutorial/auto-subscriptions)!

**Preferred**

```typescript
<script>
    import { writable } from 'svelte/store'

    const count = writable(0)
    
    $: double = $count * 2

    function increment(): void {
        $count += 1
    }
</script>

<h1>
    The count is {$count}
    The double is {double}
</h1>
<button on:click={increment}>
    Click to update count!
</button>
```

The same code can be written without using Svelte language features. The following code does the same, albeit being a bit more verbose. This is how store interactions are written in pure typescript. It is accepted, but for **Svelte components** preference is given to the style described above.

**Alternative**

```typescript
<script>
    import { onDestroy } from 'svelte'
    import { get, writable } from 'svelte/store'

    const count = writable(0)
    let double = 0

    function increment(): void {
        count.update(n => n + 1)
    }
 
    const unsubscribe = count.subscribe(() => {
 double = get(count) * 2
    })
  
    onDestroy(() => {
 unsubscribe()
    })
</script>

<h1>
    The count is {$count}
    The double is {double}
</h1>
<button on:click={increment}>
    Click to update count!
</button>
```

## Styling

### Tailwind

_TODO_

### `style` Tag

_TODO_

### Prettier

There is a [bug](https://github.com/sveltejs/prettier-plugin-svelte/issues/70) in Prettier's Svelte Plugin that replaces nested style and script tags with base58 encoded strings of vanilla JS. Use nested strings in case nested style/script tags are required.

**Bad**

```svelte
<iframe
  srcdoc={`
    <head>
      <style type="text/css">
        body {
          margin: 0px;
        }
      </style>
    </head>
 `}
/>
```

**Good**

```svelte
<iframe
  srcdoc={`
    <head>
      <${'style'} type="text/css">
        body {
          margin: 0px;
        }
      </style>
    </head>
 `}
/>
```
