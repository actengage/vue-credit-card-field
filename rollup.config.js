import plugins from './build/plugins';

import {
    BUILD_OPTIONS,
    DIST,
    EXTERNAL,
    EXTENSION_PREFIX,
    FILENAME,
    MAINJS,
    NAMESPACE,
    OUTPUT_GLOBALS,
    PACKAGE_FORMAT,
    SOURCEMAP,
    WATCH_OPTIONS,
} from './build/config';

// Export the config object
export default [{
    cache: false,
    input: MAINJS,
    output: {
        name: NAMESPACE,
        format: PACKAGE_FORMAT,
        file: `${DIST}${FILENAME}${EXTENSION_PREFIX}.js`,
        sourcemap: SOURCEMAP,
        globals: OUTPUT_GLOBALS,
        exports: 'named',
    },
    watch: WATCH_OPTIONS,
    external: EXTERNAL,
    plugins: plugins(BUILD_OPTIONS[PACKAGE_FORMAT])
},{
    input: MAINJS,
    output: {
        name: NAMESPACE,
        format: 'es',
        file: `${DIST}${FILENAME}.es${EXTENSION_PREFIX}.js`,
        sourcemap: SOURCEMAP,
        globals: OUTPUT_GLOBALS,
        exports: 'named',
    },
    watch: WATCH_OPTIONS,
    external: EXTERNAL,
    plugins: plugins(BUILD_OPTIONS.es)
}];
