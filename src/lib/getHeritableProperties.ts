import type { JSONTextComponent, TextComponentObject } from 'sandstone';
import type { HeritableKey } from './heritableKeys';
import heritableKeys from './heritableKeys';
import { ComponentClass } from 'sandstone/variables';

export type HeritableProperties = {
	[Key in HeritableKey]?: TextComponentObject[Key]
};

/** Gets an object of only the properties of a `JSONTextComponent` which can be inherited by other text components, or `undefined` if it has no such properties. */
const getHeritableProperties = (component: JSONTextComponent): HeritableProperties | undefined => {
	if (typeof component === 'object') {
		if (Array.isArray(component)) {
			return getHeritableProperties(component[0]);
		}

		if (component instanceof ComponentClass) {
			throw new Error('TODO: Handle `ComponentClass`.');
		}

		let heritableProperties: HeritableProperties | undefined;

		for (const key of heritableKeys) {
			if (component[key] !== undefined) {
				if (heritableProperties === undefined) {
					heritableProperties = {};
				}

				heritableProperties[key] = component[key] as any;
			}
		}

		return heritableProperties;
	}
};

export default getHeritableProperties;