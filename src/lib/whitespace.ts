import minify from './minify';
import SPACE_WIDTH from './getWidth/SPACE_WIDTH';

/** Returns a `JSONTextComponent` of a combination of plain and bold spaces to achieve a specified width in in-game pixels. */
const whitespace = (
	/** The number of in-game pixels to generate spaces for. */
	width: number,
	{ floor = false }: {
		/** Whether to floor the inputted width to the nearest valid whitespace, rather than (roughly) round which is the default. */
		floor?: boolean
	} = {}
) => {
	// If the width is small, then round up to the smallest valid width rather than rounding down, since it is most likely intended that the whitespace is non-zero.
	if (width > 0 && width < 4) {
		width = floor ? 0 : 4;
	}

	width = Math.floor(width);

	if (width === 0) {
		return '';
	} else if (width === 6) {
		width = 5;
	} else if (width === 7) {
		width = floor ? 5 : 8;
	} else if (width === 11) {
		width = 10;
	} else if (width < 0) {
		throw TypeError('The whitespace width must not be negative.');
	}

	const boldSpaces = width % SPACE_WIDTH;
	const plainSpaces = Math.floor(width / SPACE_WIDTH) - boldSpaces;

	return minify([
		' '.repeat(plainSpaces),
		{ text: ' '.repeat(boldSpaces), bold: true }
	]);
};

export default whitespace;