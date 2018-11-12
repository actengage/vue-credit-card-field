import { argv } from 'yargs';

// Sould run the watcher?
export const WATCH = !!argv.watch;

// Should export minified files?
export const MINIFY = !!argv.configMinify;

// Should the CSS be injected into the JS?
export const INJECT_CSS = !!argv.configInjectCss;

// Should the export exclude the CSS?
export const EXTRACT_CSS = !!argv.configExtractCss || (
    argv.configExtractCss === undefined && !INJECT_CSS
);

export default argv;
