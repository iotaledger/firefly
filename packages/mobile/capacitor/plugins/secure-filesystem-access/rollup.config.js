export default {
    input: 'dist/esm/index.js',
    output: [
        {
            file: 'dist/plugin.js',
            format: 'iife',
            name: 'capacitorMiPlugin',
            globals: {
                '@capacitor/core': 'capacitorExports',
            },
            sourcemap: false,
            inlineDynamicImports: true,
        },
    ],
    external: ['@capacitor/core'],
}
