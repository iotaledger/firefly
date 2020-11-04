import { writable } from 'svelte/store'

type SetupRoute = 'welcome' |
    'legal' |
    'setup' |
    'import' |
    'legacy' |
    'phrase' |
    'password' |
    'protect' |
    'backup' |
    'migrate' |
    'congratulations'

export const setupRoute = writable<SetupRoute>('welcome')

type SetupType = 'new' | 'import' | 'legacy' | 'phrase'
export const setupType = writable<SetupType>(null)


// enum SetupType {
//     New = 'new',
//     Import = 'import'
// }

// enum SetupStep {
//     Welcome = 'welcome',
//     Legal = 'legal',
//     Setup = 'setup',
//     Import = 'import',
//     Legacy = 'legacy',
//     Phrase = 'phrase',
//     Password = 'password',
//     Protect = 'protect',
//     Backup = 'backup',
//     Migrate = 'migrate',
//     Congratulations = 'congratulations',
// }

// type Welcome = { type: SetupStep.Welcome };
// export const form = (): Welcome => ({ type: SetupStep.Welcome });

// import { readable, writable } from 'svelte/store'
// import { notification } from '@shared-lib/app'

// /**
//  * Application path based on location hash
//  */
// export const path = readable<string>(null, (set) => {
//     const updatePath = (): void => {
//         const pathName = window.location.hash.substr(1)
//         set(pathName)

//         notification.set(null)
//     }

//     window.addEventListener('hashchange', updatePath)
//     updatePath()

//     return (): void => {
//         window.removeEventListener('hashchange', updatePath)
//     }
// })

// type SetupRoute = 'welcome' |
//     'legal' |
//     'setup' |
//     'import' |
//     'legacy' |
//     'phrase' |
//     'password' |
//     'protect' |
//     'backup' |
//     'migrate' |
//     'congratulations'

// export const setupRoute = writable<SetupRoute>('welcome')

// type SetupType = 'new' | 'import' | 'legacy' | 'phrase'
// export const setupType = writable<SetupType>(null)


// enum SetupType {
//     New = 'new',
//     Import = 'import'
// }

// enum SetupStep {
//     Welcome = 'welcome',
//     Legal = 'legal',
//     Setup = 'setup',
//     Import = 'import',
//     Legacy = 'legacy',
//     Phrase = 'phrase',
//     Password = 'password',
//     Protect = 'protect',
//     Backup = 'backup',
//     Migrate = 'migrate',
//     Congratulations = 'congratulations',
// }

// type Welcome = { type: SetupStep.Welcome };
// export const form = (): Welcome => ({ type: SetupStep.Welcome });