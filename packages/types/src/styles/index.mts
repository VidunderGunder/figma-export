import { StyleNode } from '../global.mjs';

import * as PaintStyle from './PaintStyle.mjs';
import * as EffectStyle from './EffectStyle.mjs';
import * as TextStyle from './TextStyle.mjs';
import * as GridStyle from './GridStyle.mjs';

export * from './PaintStyle.mjs';
export * from './EffectStyle.mjs';
export * from './TextStyle.mjs';
export * from './GridStyle.mjs';

export type Style = {
    name: string
    comment: string
    visible: boolean
    originalNode: StyleNode
} & (
      PaintStyle.StyleTypeFill
    | EffectStyle.StyleTypeEffect
    | TextStyle.StyleTypeText
    | GridStyle.StyleTypeGrid
)

export type GetVariableName = (
    style: Style,
    descriptor?:
        | 'font-family'
        | 'font-size'
        | 'font-style'
        | 'font-variant'
        | 'font-weight'
        | 'letter-spacing'
        | 'line-height'
        | 'text-align'
        | 'text-decoration'
        | 'text-transform'
        | 'vertical-align'
) => string;

export type StyleOutputter = (styles: Style[]) => Promise<void>
