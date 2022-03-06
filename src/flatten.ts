import type { JSONTextComponent } from 'sandstone';
import type { FlatTextComponent } from './generateFlat';
import generateFlat from './generateFlat';

/**
 * Recursively spreads all arrays and `extra` properties of a text component into one big array.
 *
 * Necessarily returns an array with `''` as the first element (but never as any other element). Any `TextComponentObject` in the returned array necessarily has more properties than just `text`.
 *
 * Does not transform `with` properties at all.
 */
const flatten = (component: JSONTextComponent): ['', ...FlatTextComponent[]] => [
	'',
	...generateFlat(component)
];

export default flatten;