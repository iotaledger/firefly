---
icon: list-unordered
---

# Imports

## Path Aliases

Path aliases are useful for avoiding long relative import paths and improving the readability of our import statements.

We use the following aliases throughout the entire application:

- `@core`
  - __Contents__: code components used in core functionality of the app, e.g. routing, internationalization (i18n), notifications
  - __Location__: `packages/shared/lib/core/`
- `@common`
  - __Contents__: code components used commonly throughout the application, e.g. functionality for sending transactions, stores for a profile
  - __Location__: `packages/shared/lib/common/`
- `@components`
  - __Contents__: re-usable Svelte UI components used inside of the route components, e.g. buttons, text, popups
  - __Location__: `packages/shared/components/`

__Bad__

```typescript
import { isStrongholdLocked } from '../../../lib/stronghold/stores'
```

__Good__

```typescript
import { isStrongholdLocked } from '@common/stronghold'
```

## Order

With clean and easy to read import statements you can quickly see the dependencies of the current code. Make sure you apply following good practices for import statements:

- There are __no__ unused imports
- Each import group __must__ be separated by a blank line
- An import group's import statements __must__ be sorted alphabetically according to their path alias
- An import statement's individual imports __must__ be sorted alphabetically according to their variable name
- All import groups __must__ adhere to this order:
  - Svelte library modules (e.g. `import { get } from 'svelte/store'`)
  - Third-party imports (e.g. `import { Converter } from '@iota/client'`)
  - Svelte UI components (e.g. `import { Button, Text } from '@components'`)
  - TypeScript `core` modules (e.g. `import { setRoute } from @core/router`)
  - TypeScript `common` modules (e.g. `import { isStrongholdLocked } from '@common/stronghold/stores'`)

:information_source: To help enforce this import strategy, we should look at something like [`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md).

__Bad__

``` typescript
import { onMount } from 'svelte'
import { get } from 'svelte/store'
import { Button, Spinner, Text } from '@components'
import { Locale } from '@core/i18n'
import { Node, NodeInfo } from '@common/client'
import { closePopup } from '@core/popup'
import { asyncGetNodeInfo, wallet } from '@common/wallet'
import { showAppNotification } from '@core/notifications'
import { setClipboard } from '@common/utils'
import { cleanNodeAuth } from '@common/network'
import { Converter } from '@iota/client'
```

__Good__

```typescript
import { onMount } from 'svelte'
import { get } from 'svelte/store'

import { Converter } from '@iota/client'

import { Button, Spinner, Text } from '@components'

import { Locale } from '@core/i18n'
import { showAppNotification } from '@core/notifications'
import { closePopup } from '@core/popup'

import { Node, NodeInfo } from '@common/client'
import { cleanNodeAuth } from '@common/network'
import { setClipboard } from '@common/utils'
import { asyncGetNodeInfo, wallet } from '@common/wallet'
```
