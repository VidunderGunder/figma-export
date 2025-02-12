import * as FigmaExport from '@figma-export/types';

import {
    getClient,
    enrichPagesWithSvg,
    getDocument,
    getPagesWithComponents,
} from './figma';

export const components: FigmaExport.ComponentsCommand = async ({
    token,
    fileId,
    version,
    onlyFromPages = [],
    filterComponent = () => true,
    transformers = [],
    outputters = [],
    concurrency = 30,
    retries = 3,
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching document');
    const figmaDocument = await getDocument(
        client,
        {
            fileId,
            version,
            onlyFromPages,
        },
    );

    const pages = getPagesWithComponents(figmaDocument, { filterComponent });

    log('preparing components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, version, {
        transformers,
        concurrency,
        retries,
        onFetchCompleted: ({ index, total }) => {
            log(`fetching components ${index}/${total}`);
        },
    });

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    log(`exported components from ${fileId}`);

    return pagesWithSvg;
};
