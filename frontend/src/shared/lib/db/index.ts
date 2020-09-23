/**
 * Mocked database for plugins access management
 */
const db: {
    modules: {
        [moduleId: string]: {
            allowed: string[]
            blocked: string[]
        }
    }
} = {
    modules: {
        button: {
            allowed: ['getAddress'],
            blocked: []
        }
    }
}

export default db;