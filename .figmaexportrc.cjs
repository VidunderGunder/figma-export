// @ts-check

/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ ./node_modules/.bin/ts-node ./packages/cli/bin/run use-config ./.figmaexportrc.example.local.ts
 */

const outputComponentsAsSvg = require('./packages/output-components-as-svg/dist/index')
const path = require('path')

/** @type {import('./packages/types').ComponentsCommandOptions} */
const componentOptions = {
    // STANDARD
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    onlyFromPages: ['cover', 'icons', 'icons/subpath', 'unit-test', 'octicons-by-github'],

    // // +2000 icons
    // fileId: 'ZmS9cHe8Z8iwWnZIGQa4oo',
    // onlyFromPages: ['🌈 Iconly Library'],
    // filterComponent: (component) => !/^figma/.test(component.name), // optional

    concurrency: 2000,
    retries: 3,

    outputters: [
        outputComponentsAsSvg.default({
            output: './output/components/svg',
            getDirname: (options) => {
                // if (options.componentName === 'paintcan') {
                //     console.log(options.pathToComponent)
                // }
                const pathToComponent = options.pathToComponent.map(p => p.name).join(path.sep)
                return `${options.pageName}${path.sep}${options.dirname}${path.sep}${pathToComponent}`
            },
        })
    ]
};

module.exports = {
    commands: [
        ['components', componentOptions],
    ]
};
