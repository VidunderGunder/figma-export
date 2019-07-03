const Figma = require('figma-js')
const axios = require('axios')
const produce = require('immer').produce

const utils = require('./utils');

let client

const setToken = token => {
    client = Figma.Client({ personalAccessToken: token })
}

const getSvgFromUrl = async url => {
    return (await axios.get(url, {
        headers: {
            'Content-Type': 'images/svg+xml',
        },
    })).data
}

const applyTransformersToSvg = (svg, transformers) => {
    return transformers.reduce((previousPromise, transform) => {
        return previousPromise.then(svg => transform.execute(svg))
    }, Promise.resolve(svg));
}

const fileImages = async (fileId, ids) => {
    return (await client.fileImages(fileId, {
        ids,
        format: 'svg',
        svg_include_id: true,
    })).data.images
}

const fileImagesToSvgs = async (images, ids, transformers = []) => {

    const svgs = await Promise.all(ids.map(id => images[id]).map(getSvgFromUrl));

    const svgsTransformed = await Promise.all(svgs.map(async svg => {
        return applyTransformersToSvg(svg, transformers)
    }));

    return utils.combineKeysAndValuesIntoObject(ids, svgsTransformed);
}

const getSvgs = async (fileId, {
    onlyFromPages = [],
    transformers = [],
    updateStatusMessage = () => {}
} = {}) => {

    if (!client) {
        throw new Error(`'Access Token' is missing. https://www.figma.com/developers/docs#authentication`)
    }

    updateStatusMessage('fetching document');

    const document = (await client.file(fileId)).data.document

    const pages = utils.getPages(document, { only: onlyFromPages })

    const componentIds = Object.values(pages).reduce((ids, components) => {
        return [
            ...ids,
            ...Object.values(components).map(component => component.id)
        ]
    }, [])

    if (componentIds.length === 0) {
        throw new Error('No components found')
    }

    updateStatusMessage('fetching components');
    const images = await fileImages(fileId, componentIds);

    updateStatusMessage('fetching svgs');
    const svgs = await fileImagesToSvgs(images, componentIds, transformers);

    return produce(pages, draft => {
        for ([pageName, components] of Object.entries(pages)) {
            for ([componentName, component] of Object.entries(components)) {
                draft[pageName][componentName].svg = svgs[component.id];
            }
        }
    });
}

module.exports = {
    getSvgs,
    setToken
}
