import typescriptPlugin from 'rollup-plugin-typescript2';
import pkg from './package.json' assert {type: 'json'};
import typescript from 'typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'iife',
            name: 'Firework'
        },
        {
            file: pkg.module,
            format: 'es',
            name: 'Firework'
        },
    ],
    plugins: [
        typescriptPlugin({
            typescript: typescript,
        }),
        livereload({
            watch: 'dist',
        }),
        serve({
            open: true
        })
    ]
};