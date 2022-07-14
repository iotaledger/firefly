Object.defineProperty(window, 'crypto', {
    value: { getRandomValues: jest.fn().mockReturnValue(new Uint32Array(10)) },
})
