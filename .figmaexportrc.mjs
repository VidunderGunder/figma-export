// @ts-check

/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ ./node_modules/.bin/ts-node ./packages/cli/bin/run use-config ./.figmaexportrc.example.local.ts
 */

import outputStylesAsCss from './packages/output-styles-as-css/dist/index.mjs'
import outputStylesAsLess from './packages/output-styles-as-less/dist/index.mjs'
import outputStylesAsSass from './packages/output-styles-as-sass/dist/index.mjs'
import outputStylesAsStyleDictionary from './packages/output-styles-as-style-dictionary/dist/index.mjs'
import * as utils from './packages/utils/dist/index.mjs'
import outputComponentsAsEs6 from './packages/output-components-as-es6/dist/index.mjs'
import outputComponentsAsSvg from './packages/output-components-as-svg/dist/index.mjs'
import outputComponentsAsSvgr from './packages/output-components-as-svgr/dist/index.mjs'
import outputComponentsAsSvgstore from './packages/output-components-as-svgstore/dist/index.mjs'
import transformSvgWithSvgo from './packages/transform-svg-with-svgo/dist/index.mjs'
import path from 'path'

/** @type {import('./packages/types').StylesCommandOptions} */
const styleOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    onlyFromPages: ['icons'],
    outputters: [
        outputStylesAsCss({
            output: './output/styles/css'
        }),
        outputStylesAsLess({
            output: './output/styles/less'
        }),
        outputStylesAsSass({
            output: './output/styles/sass',
        }),
        outputStylesAsStyleDictionary({
            output: './output/styles/style-dictionary',
            // getVariableName: (style, descriptor) => `${utils.snakeCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
            // getVariableName: (style, descriptor) => `${style.styleType === 'TEXT' ? 'font-' : ''}${descriptor != null ? `${descriptor}-` : ''}${utils.kebabCase(style.name).toLowerCase()}`,
        }),
    ]
};

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

    transformers: [
        transformSvgWithSvgo({
            plugins: [
                {
                    name: 'preset-default',
                    params: {
                        overrides: {
                            removeViewBox: false,
                        }
                    }
                },
                {
                    name: 'removeDimensions'
                }
            ]
        })
    ],
    outputters: [
        outputComponentsAsEs6({
            output: './output/components/es6',
            useBase64: true,
        }),
        outputComponentsAsSvg({
            output: './output/components/svg',
            getDirname: (options) => {
                // if (options.componentName === 'paintcan') {
                //     console.log(options.pathToComponent)
                // }
                const pathToComponent = options.pathToComponent.map(p => p.name).join(path.sep)
                return `${options.pageName}${path.sep}${options.dirname}${path.sep}${pathToComponent}`
            },
        }),
        outputComponentsAsSvgr({
            output: './output/components/svgr',
            getFileExtension: () => '.tsx',
            getComponentName: (options) => utils.pascalCase(options.basename),
            getComponentFilename: (options) => utils.kebabCase(options.basename).toLowerCase(),
            getSvgrConfig: () => ({
                typescript: true,
                jsxRuntime: 'automatic',
                template: ({ componentName, props, jsx, exports, imports }, { tpl }) => tpl`
                    ${imports}
                    const ${componentName} = (${props}) => (${jsx});
                    ${exports}
                `
            })
        }),
        outputComponentsAsSvgstore({
            output: './output/components/svgstore',
            svgstoreConfig: {
                
            }
        })
    ]
};

export default {
    commands: [
        ['styles', styleOptions],
        ['components', componentOptions],
    ]
};
