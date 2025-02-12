import * as Figma from 'figma-js';
import * as FigmaExport from '@figma-export/types';

import { notNullish } from '../utils';

import { parse as parsePaintStyle } from './paintStyle';
import { parse as parseEffectStyle } from './effectStyle';
import { parse as parseTextStyle } from './textStyle';
// import { parse as parseGridStyle } from './gridStyle';

const fetchStyles = async (
    client: Figma.ClientInterface,
    fileId: string,
    styles: { readonly [key: string]: Figma.Style },
    version?: string,
): Promise<FigmaExport.StyleNode[]> => {
    const styleIds = Object.keys(styles);

    if (styleIds.length === 0) {
        throw new Error('No styles found');
    }

    const { data: { nodes } } = await client.fileNodes(fileId, { ids: styleIds, version }).catch((error: Error) => {
        throw new Error(`while fetching fileNodes: ${error.message}`);
    });

    const styleNodes = Object.values(nodes).map((node) => node?.document);

    return styleNodes.map((node) => ({
        ...(node ? styles[node.id] : ({} as Figma.Style)),
        ...(node as Figma.Node),
    }));
};

const parseStyles = (styleNodes: FigmaExport.StyleNode[]): FigmaExport.Style[] => {
    return styleNodes.map((node) => {
        const parsedStyles = undefined
            || parsePaintStyle(node)
            || parseEffectStyle(node)
            || parseTextStyle(node);
            // || parseGridStyle(node)

        if (!parsedStyles) {
            return undefined;
        }

        return {
            name: node.name,
            comment: node.description,
            visible: node.visible !== false,
            originalNode: node,
            ...parsedStyles,
        };
    }).filter(notNullish);
};

export {
    fetchStyles,
    parseStyles,
};
