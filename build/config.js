import pkg from "../package.json";
import { kebabCase } from 'lodash';
import { camelCase } from 'lodash';
import { upperFirst } from 'lodash';
import * as argsConfig from './config/args';
import * as pathsConfig from './config/paths';
import buildConfig from './config/build';
import globalsConfig from './config/globals';
import externalConfig from './config/external';
import livereloadConfig from './config/livereload';
import postcssConfig from './config/postcss';
import serveConfig from './config/serve';
import watchConfig from './config/watch';

// The type of package Rollup should create
export const PACKAGE_FORMAT = 'umd';

// The directory of the package source code files
export const SRC = pathsConfig.SRC;

// The directory to ouput the compiled files
export const DIST = pathsConfig.DIST;

// The node_modules directory path
export const NODE_MODULES = pathsConfig.NODE_MODULES;

// The main.js or entry point of your package
export const MAINJS = `${SRC}main.js`;

// The base filename of the compiled files (no ex)
export const FILENAME = kebabCase(pkg.name);

// This is global variable used in UMD packages
export const NAMESPACE = upperFirst(camelCase(pkg.name));

// Sould run the watcher?
export const WATCH = argsConfig.WATCH;

// The sourcemap format. Accepted values: `inline`, `true`, `false`
export const SOURCEMAP = WATCH ? 'inline' : true;

// Should export minified files?
export const MINIFY = argsConfig.MINIFY;

// Add .min prefix to all extensions if MINIFY is `true`.
export const EXTENSION_PREFIX = MINIFY ? '.min' : '';

// Should the CSS be injected into the JS?
export const INJECT_CSS = argsConfig.INJECT_CSS;

// Should the export exclude the CSS?
export const EXTRACT_CSS = argsConfig.EXTRACT_CSS;

// The options for the livereload plugin (undefined or object).
export const LIVERELOAD_OPTIONS = livereloadConfig;

// The options for the serve() plugin
export const SERVE_OPTIONS = serveConfig;

// The options for the watch plugin
export const WATCH_OPTIONS = watchConfig;

// Build specific overrides
export const BUILD_OPTIONS = buildConfig;

// Define an array of external packages to not include in the bundle
export const EXTERNAL = externalConfig;

// Define the list of output globals
export const OUTPUT_GLOBALS = globalsConfig;

// The defined PostCSS plugins that should be used. `null` values will be filtered.
export const POSTCSS_PLUGINS = postcssConfig.filter(value => !!value);
