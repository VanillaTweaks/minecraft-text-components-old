import getHeritableKeys from '../getHeritableKeys';
import type { JSONTextComponent } from 'sandstone';
import isAffectedByInheriting from './isAffectedByInheriting';
import generateFlat from '../generateFlat';

/**
 * Returns the `subcomponents` array with `''` inserted at the beginning, only if necessary to prevent other subcomponents from inheriting properties from the first.
 *
 * ⚠️ Only for use in `minify`. Assumes `subcomponents.length > 1`. May mutate the `subcomponents` array.
 */
const disableInheritanceIfNecessary = (subcomponents: JSONTextComponent[]) => {
	// Check if other subcomponents would inherit unwanted properties from the first subcomponent.

	const heritableKeys = getHeritableKeys(subcomponents[0]);
	if (heritableKeys.length) {
		for (let i = 1; i < subcomponents.length; i++) {
			const subcomponent = subcomponents[i];

			for (const flatSubcomponent of generateFlat(subcomponent)) {
				if (isAffectedByInheriting(flatSubcomponent, heritableKeys)) {
					subcomponents.unshift('');
					return subcomponents;
				}
			}
		}
	}

	return subcomponents;
};

export default disableInheritanceIfNecessary;