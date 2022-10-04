import { createExternalUrlMenuItem } from '../create-external-url-menu-item.helper'
import { DISCORD_URL } from 'shared/lib/contexts/settings/constants'

describe('File: create-external-url-menu-item.helper.ts', () => {
    describe('Function: createExternalUrlMenuItem', () => {
        it('should be true', () => {
            expect(createExternalUrlMenuItem('discord', DISCORD_URL)).not.toEqual(undefined)
        })
    })
})
