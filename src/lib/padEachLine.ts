import type { JSONTextComponent } from 'sandstone';
import split from './split';
import getSingleLineWidth from './getWidth/getSingleLineWidth';
import whitespace from './whitespace';
import join from './join';
import { containerWidth } from './withContainer';
import minify from './minify';
import wrap from './wrap';

/** Adds whitespace before each line of a text component (counting lines caused by wrapping), automatically minified. */
const padEachLine = (
	component: JSONTextComponent,
	/** The ideal number of in-game pixels of whitespace to insert before each line in in-game pixels, or a function which returns the ideal amount of whitespace for each line it's called on. */
	idealPaddingWidth: number | (
		(
			/** The width of the line (with start and end whitespaced trimmed off) in in-game pixels. */
			width: number
		) => number
	)
) => {
	const idealPaddingWidthArgument = idealPaddingWidth;
	const getIdealPaddingWidth = (
		typeof idealPaddingWidthArgument === 'number'
			? () => idealPaddingWidthArgument
			: idealPaddingWidthArgument
	);

	return minify(join(
		split(wrap(component), '\n').map(componentLine => {
			const width = getSingleLineWidth(componentLine);

			if (width === 0) {
				// If the line is empty, just leave it empty rather than adding useless padding.
				return '';
			}

			if (width > containerWidth) {
				throw new TypeError(
					'The width of the following line exceeds the width of the container:\n'
					+ JSON.stringify(minify(componentLine))
				);
			}

			idealPaddingWidth = getIdealPaddingWidth(width);
			let padding = whitespace(idealPaddingWidth);
			const paddingWidth = getSingleLineWidth(padding);

			if (width + paddingWidth > containerWidth) {
				padding = whitespace(idealPaddingWidth, { floor: true });
			}

			return ['', padding, componentLine];
		}),
		'\n'
	));
};

export default padEachLine;