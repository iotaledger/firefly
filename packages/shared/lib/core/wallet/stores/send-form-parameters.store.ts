import { writable, Writable } from 'svelte/store'
import { ISendFormParameters } from '..'

export const sendFormParameters: Writable<ISendFormParameters> = writable()
