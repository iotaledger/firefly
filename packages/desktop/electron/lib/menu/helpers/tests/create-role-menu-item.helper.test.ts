import { createRoleMenuItem } from '../create-role-menu-item.helper'

describe('File: create-role-menu-item.helper.ts', () => {
    describe('Function: createRoleMenuItem', () => {
        it('should be true', () => {
            expect(createRoleMenuItem('copy')).not.toEqual(undefined)
        })
    })
})
