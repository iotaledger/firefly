---
icon: comment-discussion
---

# Comments
> Every time you express yourself in code, you should pat yourself on the back. Every time you write a comment, you should grimace and feel the failure of your ability of expression.

In general it is preferable to avoid writing comments, especially if there is a way to __cleanly express the logic with the code itself__ (aka [_self-documenting code_](https://en.wikipedia.org/wiki/Self-documenting_code)). Otherwise, we adhere to the following rules about comments:
- __Do NOT write comments that are noisy or state the obvious__

    ```typescript
    // get and check store for if Stronghold is locked
    if (get(isStrongholdLocked)) {
        // ...
    }

    /** The app settings. */
    type AppSettings {
        language: string
        isInDarkMode: boolean
        areDeepLinksEnabled: boolean
    }
    ```

- __Do NOT write `TODO` comments__

    ```typescript
    // TODO: Abstract this code and move to wallet.ts
    ```
    
    :information_source: If you find yourself writing `TODO` comments, instead [create a new task](https://github.com/iotaledger/firefly/issues/new?assignees=&labels=&template=create-task.yml&title=%5BTask%5D%3A+) on GitHub or add to your existing task's requirements list.

- __Do NOT write embedded comments__

    __Bad__

    ```typescript 
    function someFunction(): void { // this function does something
    }
    ```

    __Good__

    ```typescript
    // this function does something
    function someFunction(): void {
    }
    ```

- __They should be preceded by a blank _without_ a following a blank line__

    __Bad__

    ```typescript 
    const anArray = ["a string"]
    // a comment about this other array

    const anotherArray = ["another string"]
    ```
    
    __Good__
    
    ```typescript 
    const anArray = ["a string"]

    // a comment about this other array
    const anotherArray = ["another string"]
    ```
