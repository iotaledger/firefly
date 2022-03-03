export default {
    input: 'dist/esm/index.js',
    output: [
        {
            file: 'dist/plugin.js',
            format: 'iife',
            name: 'capacitorPlugin',
            globals: {
                '@capacitor/core': 'capacitorExports',
            },
            sourcemap: true,
            inlineDynamicImports: true,
        },
    ],
    external: ['@capacitor/core'],
}
