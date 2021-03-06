import type { HeritableKey } from '../heritableKeys';
import { whitespaceAffectedByKeys } from '../heritableKeys';
import type { FlatTextComponent } from '../generateFlat';
import { notLineBreaks, notWhitespace } from './regex';

export type IsAffectedByInheritingOptions = {
	/**
	 * Whether the component's text is only whitespace.
	 *
	 * If undefined, will be computed automatically if necessary.
	 */
	textIsWhitespace?: boolean,
	/**
	 * Whether the component's text is only line breaks.
	 *
	 * If undefined, will be computed automatically if necessary.
	 */
	textIsLineBreaks?: boolean
};

/** Checks whether a specified `FlatTextComponent` inheriting the specified properties has a distinguishable in-game effect on the component. */
const isAffectedByInheriting = (
	component: FlatTextComponent,
	/** The keys of properties to check for whether the component is affected by inheriting them. */
	keys: HeritableKey[],
	{ textIsWhitespace, textIsLineBreaks }: IsAffectedByInheritingOptions = {}
) => {
	if (keys.length === 0) {
		return false;
	}

	const setText = (text: string) => {
		if (textIsWhitespace === undefined) {
			textIsWhitespace = !notWhitespace.test(text);
		}

		if (textIsLineBreaks === undefined) {
			textIsLineBreaks = textIsWhitespace && !notLineBreaks.test(text);
		}
	};

	if (typeof component === 'object') {
		if ('text' in component) {
			setText(component.text.toString());

			if (textIsLineBreaks) {
				// Nothing affects line breaks.
				return false;
			}
		}

		// Check if a property that affects this component is missing from this component, in which case this component would inherit it.
		return keys.some(
			textIsWhitespace
				? key => (
					component[key] === undefined
					&& (whitespaceAffectedByKeys as readonly string[]).includes(key)
				)
				: key => component[key] === undefined
		);
	}

	// If this point is reached, the component is a plain primitive.

	setText(component.toString());

	if (textIsLineBreaks) {
		// Nothing affects line breaks.
		return false;
	}

	if (textIsWhitespace) {
		// Check if any property affects whitespace.
		return keys.some(
			key => (whitespaceAffectedByKeys as readonly string[]).includes(key)
		);
	}

	// Plain non-whitespace text is affected by any property.
	return true;
};

export default isAffectedByInheriting;