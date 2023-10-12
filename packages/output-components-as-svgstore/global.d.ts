// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Options, SvgStore } from './src/svgstore.mts';

declare global {
    export function svgstore(options: Options): SvgStore;
}
