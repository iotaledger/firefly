---
icon: paintbrush
---

# Components

- Component-related TypeScript code (`enums`, `interfaces`, `types`, etc.) **MUST** live in the component file itself
- Component names should be appended with the corresponding type of component, i.e. a “view” component should be named `SomeComponentView`(the filename should also match)
- Props `classes` have to disappear. If we need to style a component, we can wrap up and apply the classes to the wrapper
- Platform conditionals should be avoided at all times, and variations should be used instead.

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

    function onClick(): void {
        $count += 1
    }
</script>

<h1>
    The count is {$count}
    The double is {double}
</h1>
<button on:click={onClick}>
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

    function onClick(): void {
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
<button on:click={onClick}>
    Click to update count!
</button>
```

## Styling

- `style` attribute should only be used for variables `style:--opacity={elementX / screenWidth}`
    - Good
        ```jsx

        <footer
            style:--keyboard-height={$isKeyboardOpen ? ($keyboardHeight + 'px') : 0}
        >
            <slot name="footer" />
        </footer>
        
        <style lang="scss">
            footer {
                margin-bottom: var(--keyboard-height);
            }
        </style>
        ```
        
    - Bad
    
        ```jsx
        <footer style={$isKeyboardOpen && `margin-bottom: ${$keyboardHeight}px`}>
            <slot name="footer" />
        </footer>
        ```
        
    
- component with multiple variants: the preferred approach is a combination of classes and the style tag, vs creating a string composed of classes generated in TS
    - Preferred: CSS approach
    
      ```jsx
      <script lang="ts">
        export let roundedCorners: boolean = false
      <script lang="ts">
      
      <div class:rounded-corners={roundedCorners}>Box</div>
      
      <style lang="scss">
          div {
            &.rounded-corners {
                  @apply rounded-sm;
              }
          }
      </style>
      ```
    
    - Other: TS approach
    
      ```jsx
      <script lang="ts">
        export let roundedCorners: boolean = false
      
        let classes: string = ''
        $: $$props, setClasses()
        
        function setClasses() {
          if (roundedCorners) {
            classes = 'rounded-sm'
          } else {
            classes = ''
          }
        }
      <script lang="ts">
      
      <div class={classes}>Box</div>
      ```
    
- If a component needs a style that is not inside the tailwind scope, the custom style should be added in the style CSS section
    - Good
    
      ```jsx
      <div>Box</div>
      <style lang="scss">
        div {
          min-width: 35px;
        }
      </style>
      ```
    
    - Bad
    
      ```jsx
      <div style="min-width: 35px;">Box</div>
      ```
    
- Max nested children = 1
    - Good
        
        ```jsx
        <button {disabled}>
            <span class:pink>Button</span>
        </button>
        <style lang="scss">
            button {
                @apply bg-blue-50;
                &:disabled {
                    @apply bg-opacity-50;
                }
            }
            span {
                &.pink {
                    @apply text-pink-50;
                }
            }
        </style>
        ```
        
    - Bad
        
        ```jsx
        <button {disabled}>
            <span class:pink>Button</span>
        </button>
        <style lang="scss">
            button {
                @apply bg-blue-50;
                &:disabled {
                    @apply bg-opacity-50;
                }
                span {
                    &.pink {
                        @apply text-pink-50;
                    }
                }
            }
        </style>
        ```
        
- The preferred way to add styles to a DOM element that does not have variants, is by adding tailwind classes in the `class` attribute
    - Good
        
        ```jsx
        <div class="bg-blue-500">Box</div>
        ```
        
    - Bad
        
        ```jsx
        <div>Box</div>
        <style lang="scss">
            button {
                @apply bg-blue-50;
        		}
        </style>
        ```
        
- The preferred way to add styled to a DOM element that does have variants, is by adding tailwind classes in the `style` section
    - Good
        
        ```jsx
        <div class:ghost>Box</div>
        <style lang="scss">
            button {
                @apply bg-blue-50;
                &.ghost {
                    @apply bg-gray-50;
                }
            }
        </style>
        ```
        
    - Bad
        
        ```jsx
        <div class={ghost ? 'bg-gray-50' : 'bg-blue-50'}>Box</div>
        ```
        
- The same DOM element should not contain a combination of tailwind classes (in the `class` attribute) & CSS (in the `style` section), unless the required styling does not exist in tailwind
- Custom HTML tags are preferred
    - Good
        
        ```jsx
        <text-hint class="block text-blue-500">This is a hint</text-hint>
        ```
        
    - Bad
        
        ```jsx
        <div class="text-blue-500">This is a hint</div>
        ```
        
- When writing tailwind classes, string concatenation should be avoided because the tailwind purging process skips string concatenations
    - Good
        
        ```jsx
        <script lang="ts">
            export let primary: boolean = false

            let backgroundClass: string = getBackgroundClass()

            function getBackgroundClass(): string {
                if (primary) {
                    return 'bg-blue-500'
                } else {
                    return 'bg-pink-500'
                }
            }
        </script>

        <div class={backgroundClass}>Box</div>

        ```
        
    - Bad
        
        ```jsx
        <div class="bg-{color}-500">Box</div>
        ```

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
