import { DIST, SRC } from './paths';
import uglify from 'rollup-plugin-uglify-es';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: `${SRC}polyfills.js`,
    output: {
        format: 'iife',
        file: `${DIST}polyfills.min.js`
    },
    plugins: [
        resolve(),
        commonjs(),
        uglify()
    ]
}
