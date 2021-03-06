import type { JSONTextComponent, TextComponentObject } from 'sandstone';
import type { HeritableProperties } from './getHeritableProperties';
import getHeritableProperties from './getHeritableProperties';
import { ComponentClass } from 'sandstone/variables';

export type FlatTextComponent = (
	string | number | boolean
	| (TextComponentObject & { extra?: never })
);

/**
 * Generates the series of primitives and `TextComponentObject`s needed to recursively spread all arrays and `extra` properties of a text component into one big array.
 *
 * Never yields `''`. No yielded subcomponent is a reference to any of the inputted subcomponents, so it is safe to mutate the shallow properties of any yielded object.
 *
 * Does not transform `with` properties at all.
 */
const generateFlat = function* (
	component: JSONTextComponent,
	/** Properties for the component and its children to inherit. */
	properties?: HeritableProperties
): Generator<FlatTextComponent, void> {
	if (typeof component === 'object') {
		if (Array.isArray(component)) {
			if (component.length) {
				const heritableProperties = getHeritableProperties(component[0]);
				for (const subcomponent of component) {
					yield* generateFlat(subcomponent, heritableProperties);
				}
			}

			return;
		}

		if (component instanceof ComponentClass) {
			throw new Error('TODO: Handle `ComponentClass`.');
		}

		const { extra, ...subcomponentWithoutExtra } = component;

		yield {
			// Add the content-related properties first, just to be conventional about the property order (along with the original formatting-related properties).
			...subcomponentWithoutExtra,
			// Add the inherited formatting-related properties.
			...properties,
			// But we don't want the inherited to overwrite the original properties, so spread the original properties again.
			...subcomponentWithoutExtra
		};

		if (extra !== undefined) {
			const heritableProperties = getHeritableProperties(component);
			properties = (properties || heritableProperties) && {
				...properties,
				...heritableProperties
			};
			for (const subcomponent of extra) {
				yield* generateFlat(subcomponent, properties);
			}
		}

		return;
	}

	// If this point is reached, `component` is primitive.

	if (component === '') {
		return;
	}

	yield properties ? {
		text: component,
		...properties
	} : (
		component
	);
};

export default generateFlat;