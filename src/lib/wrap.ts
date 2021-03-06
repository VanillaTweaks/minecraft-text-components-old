import type { JSONTextComponent } from 'sandstone';
import split from './split';
import getSingleLineWidth from './getWidth/getSingleLineWidth';
import { containerWidth } from './withContainer';
import generateSplit from './generateSplit';

/** Inserts `\n` characters in a text component where there would otherwise be line breaks due to the text overflowing the container. */
const wrap = <Component extends JSONTextComponent>(
	component: Component
): Component extends string ? string : JSONTextComponent => {
	const output: JSONTextComponent[] = [];
	let outputLine: JSONTextComponent[] = [];
	let outputWord: JSONTextComponent[] = [];
	let outputLineWidth = 0;
	let outputWordWidth = 0;

	/** Pushes the `outputLine` to the `output`, and then resets the `outputLine` and `outputLineWidth`. */
	const endLine = () => {
		if (output.length !== 0) {
			output.push('\n');
		}
		output.push(outputLine);

		outputLine = [];
		outputLineWidth = 0;
	};

	/** Pushes the `outputWord` to the `outputLine`, and then resets the `outputWord` and `outputWordWidth`. */
	const endWord = (
		{ beforeWord }: {
			/** A text component to insert before the word being added to the line. */
			beforeWord?: JSONTextComponent
		} = {}
	) => {
		if (!(beforeWord === undefined || outputLine.length === 0)) {
			outputLine.push(beforeWord);
		}
		outputLine.push(outputWord);

		outputWord = [];
		outputWordWidth = 0;
	};

	for (const line of generateSplit(component, '\n')) {
		const wordsAndSpaces = split(line, /( )/);

		let space: JSONTextComponent | undefined;
		for (let wordOrSpaceIndex = 0; wordOrSpaceIndex < wordsAndSpaces.length; wordOrSpaceIndex++) {
			if (wordOrSpaceIndex % 2 === 0) {
				const word = wordsAndSpaces[wordOrSpaceIndex];

				for (const codePoint of generateSplit(word, string => (
					// `...string` splits the `string` on its code points rather than its characters (to account for surrogate pairs).
					// Prepending an empty string ensures that every input (e.g. `['ab', 'cd']`) is split into
					// an array in which each element has at most one code point (e.g. `['', 'a', ['', 'b', ''], 'c', 'd']`)
					// rather than an array in which some elements have multiple code points (e.g. `['a', ['', 'b', 'c'], 'd']`).
					['', ...string]
				))) {
					// `codePoint` either is empty or has only a single code point.

					const codePointWidth = getSingleLineWidth(codePoint);
					outputWordWidth += codePointWidth;

					if (outputWordWidth > containerWidth) {
						// Wrap this code point to the next line, breaking the word.
						endWord();
						endLine();

						outputLineWidth = outputWordWidth = codePointWidth;
					} else {
						outputLineWidth += codePointWidth;

						if (outputLineWidth > containerWidth) {
							// Wrap this word to the next line, not breaking the word.
							endLine();

							outputLineWidth = outputWordWidth;
						}
					}

					outputWord.push(codePoint);
				}

				endWord({ beforeWord: space });
			} else {
				space = wordsAndSpaces[wordOrSpaceIndex];

				outputLineWidth += getSingleLineWidth(space);
			}
		}

		endLine();
	}

	return output as Component extends string ? string : JSONTextComponent;
};

export default wrap;