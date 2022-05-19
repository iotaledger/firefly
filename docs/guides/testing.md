---
icon: beaker
---

# Testing

Welcome to the Firefly testing guide! Here you will find all of the information regarding how we setup and run tests.

:information_source: Please refer to the [test](./coding-conventions/typescript-library/#tests) section of the coding conventions guide for more info on writing tests.

## Jest

We use [Jest](https://jestjs.io/) for testing mainly business logic* of Firefly, which is mostly TS/JS source code files in the `packages/shared/lib` directory. It is important that any files or functions added here __should have__ corresponding unit or integration tests.

\* _Test coverage is low at this point, but we look to increase that soon with an emphasis on more important functionalities (i.e. transactions, migrating, etc.). Additionally we are looking at adding tests for some important Svelte components._

## Running Tests

As only business logic is being tested at the moment, running tests can be done quite simply:

```bash
# run tests for source code in packages/shared/lib
yarn test:shared
```

To run all tests (still only source code in `packages/shared/lib` at the moment):

```bash
# run tests for all source code
yarn test
```

An example of a happy output:

```bash
PASS  lib/tests/the-file.test.ts
  File: the-file.ts
    Function: theFunctionToTest
      ✓ should do something (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.609 s
Ran all test suites.
```
