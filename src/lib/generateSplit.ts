import type { JSONTextComponent } from 'sandstone';
import type { FlatTextComponent } from './generateFlat';
import generateFlat from './generateFlat';

export type SeparatorOrSplitFunction = string | RegExp | (
	(
		/** The string being split. */
		string: string
	) => string[]
);

const splitPrimitive = (
	component: string | number | boolean,
	separatorOrSplitFunction: SeparatorOrSplitFunction
) => {
	component = component.toString();

	const splitString = (
		typeof separatorOrSplitFunction === 'function'
			? separatorOrSplitFunction(component)
			: component.split(separatorOrSplitFunction)
	);

	// Ensure we never return an empty array.
	if (splitString.length === 0) {
		splitString.push('');
	}

	return splitString;
};

/**
 * Generates the series of subcomponents split from a specified `JSONTextComponent`.
 *
 * Always yields at least one value.
 */
const generateSplit = function* (
	component: JSONTextComponent,
	/** The pattern on which each split should occur, or a function that takes a string and returns the string split into an array. */
	separatorOrSplitFunction: SeparatorOrSplitFunction
) {
	let previousSubcomponent: (
		FlatTextComponent
		| ['', ...FlatTextComponent[]]
		| undefined
	);

	const appendToPreviousSubcomponent = (subcomponent: FlatTextComponent) => {
		if (previousSubcomponent === undefined) {
			previousSubcomponent = subcomponent;
		} else if (Array.isArray(previousSubcomponent)) {
			previousSubcomponent.push(subcomponent);
		} else {
			previousSubcomponent = [
				'',
				previousSubcomponent,
				subcomponent
			];
		}
	};

	for (const subcomponent of generateFlat(component)) {
		let splitSubcomponent;

		if (typeof subcomponent === 'object') {
			if (!('text' in subcomponent)) {
				// We can't split something without text.
				appendToPreviousSubcomponent(subcomponent);
				continue;
			}

			splitSubcomponent = splitPrimitive(
				subcomponent.text,
				separatorOrSplitFunction
			).map(substring => ({
				...subcomponent,
				text: substring
			}));
		} else {
			splitSubcomponent = splitPrimitive(
				subcomponent,
				separatorOrSplitFunction
			);
		}

		appendToPreviousSubcomponent(splitSubcomponent[0]);

		for (let i = 1; i < splitSubcomponent.length; i++) {
			yield previousSubcomponent!;

			previousSubcomponent = splitSubcomponent[i];
		}
	}

	yield previousSubcomponent ?? '';
};

export default generateSplit;