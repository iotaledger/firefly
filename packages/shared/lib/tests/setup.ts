/**
 * NOTE: This file is before creating additional setup for the testing
 * environment as needed (e.g. a particular object must be mocked or is mocked
 * everywhere).
 */
import './__mocks__/api.mock'
import './__mocks__/match-media.mock'
import './__mocks__/platform.mock'
import { TextEncoder, TextDecoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })

beforeAll(async () => {})
afterAll(async () => {})
