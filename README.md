# SampleComponent.vue

The purpose of this project is to provide a boilerplate to quickly create
reusable Vue components that are intended to be published as dependencies using
all the latest JS goodies that take into account the every-evolving best
practices in the world of JavaScript. This is very much a rolling target, so any
collaboration is very much welcome and appreciated.

### What is the *real* purpose behind this project?

With the ES6 becoming the norm, it makes sense to start packaging more of what
we create into reusable bundles. Node developers have taken this to the extreme,
but it does work (most of the time). What prevents me personally from writing
more distributable code is literally the act of creating a new repo, the
directory structure, adding dependencies, defining a structure for the source,
eventually coming up with a name, then there is documentation, examples
and tests. Setting everything up is a constant battle and a huge amount of time
that inherently prevents me from starting the task.

So this boilerplate is a way to make all of *that* as painless as possible...

### So why use this boilerplate instead of something else?

There is obviously more than one way to skin a cat. This project is meant to be
opinionated and meant to make decisions so that I don't have make them later. It
also attempts to utilize as few dependencies as possible. Many examples
available use Webpack, but project uses Rollup for simplicity. At the time of
this writing, almost all the examples use Babel6, but this project uses the
upcoming Babel7.

### Unit Testing

So this is a hot topic, and is a moving target, so to speak. After using a few
testing suites and a lot of reading, I decided on Jest. Like everything, it has
pros and cons, but it has that "it just works" feel to it and is extremely easy
to configure and use. And people have done the hard work with Vue and seems to
be a popular choice with ample documentation and examples.

### Features

- Pre-configured Babel7
- Pre-configured Rollup.js config
- Pre-configured SASS/SCSS
- Pre-configured unit tests with Jest
- Pre-defined commands for building, publishing, and testing
- Uglification & Minification of source files
- Automated UMD build and bundle naming conventions
- Browser server/livereload

### Commands

`npm run dev`

Start the Rollup build process and watch the source files and
trigger livereload when a file changes.

`npm run commit`

Makes a GIT commit with the current version from package.json. (This command is
called automatically in the `npm run release` command.)

`npm run release-patch`

Compiles the latest source files, makes an incremental version bump (1.0.x) to
package.json, then makes a commit with new version, and finally publishes the
latest build to NPM.

`npm run release-minor`

Compiles the latest source files, makes a minor version bump (1.x.0) to
package.json, then makes a commit with new version, and finally publishes the
latest build to NPM.

`npm run release-major`

Compiles the latest source files, makes a major version bump
(x.1.0) to package.json, then makes a commit with new version, and finally
publishes the latest build to NPM.

`npm run release`

Compiles the latest source files for release, runs the
uglification process, makes the commit, and published the package. This command
is called automatically uses any of the other `npm run release-{type}` commands.

`npm run uglify`

Rund the uglify library over the compiled source to create a
`{package-name}.min.js` file that Gzip and minifies that library.
