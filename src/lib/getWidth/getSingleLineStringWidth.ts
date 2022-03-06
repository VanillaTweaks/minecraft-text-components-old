import type { GetCodePointWidthOptions } from './getCodePointWidth';
import getCodePointWidth from './getCodePointWidth';

/**
 * Gets the width in in-game pixels that a string takes up.
 *
 * ⚠️ Assumes the input does not contain line breaks.
 */
const getSingleLineStringWidth = (
	string: string,
	options: GetCodePointWidthOptions = {}
) => {
	let width = 0;

	for (const codePoint of string) {
		width += getCodePointWidth(codePoint, options);
	}

	return width;
};

export default getSingleLineStringWidth;