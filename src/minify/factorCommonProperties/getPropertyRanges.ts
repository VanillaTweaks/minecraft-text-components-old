import type { FlatTextComponent } from '../../flatten';
import isAffectedByInheriting from '../isAffectedByInheriting';
import getHeritableKeys from '../../getHeritableKeys';
import type PropertyBoundary from './PropertyBoundary';
import PropertyStart from './PropertyStart';
import type { PropertyString } from './getPropertyString';
import getPropertyString from './getPropertyString';

const getPropertyRanges = (subcomponents: FlatTextComponent[]) => {
	/** All subcomponents with `PropertyBoundary`s mixed in to mark where properties start and end within the subcomponents (ordered). */
	const nodes: Array<FlatTextComponent | PropertyBoundary> = [];
	/** The `PropertyStart`s of all property ranges (unordered). */
	const properties: PropertyStart[] = [];

	/** Pushes a `PropertyBoundary` to `nodes`, setting its `index`. */
	const pushPropertyNode = (propertyBoundary: PropertyBoundary) => {
		propertyBoundary.index = nodes.length;
		nodes.push(propertyBoundary);
	};

	/** A mapping from each `PropertyString` to its `PropertyStart` if it has no respective `PropertyEnd` yet. */
	const openProperties: Record<PropertyString, PropertyStart> = {};

	/** Marks the end of a range of subcomponents which are unaffected by the specified property, and removes the specified property from `openProperties`. */
	const endProperty = (property: PropertyStart) => {
		pushPropertyNode(property.end);

		delete openProperties[property.string];
	};

	for (const subcomponent of subcomponents) {
		// End any open properties that would affect this subcomponent.
		for (const property of Object.values(openProperties).reverse()) {
			if (isAffectedByInheriting(subcomponent, [property.key])) {
				endProperty(property);
			}
		}

		if (typeof subcomponent === 'object') {
			// Start or continue properties which this subcomponent has.

			/** Properties which this subcomponent has. */
			const subcomponentProperties: PropertyStart[] = [];

			for (const key of getHeritableKeys(subcomponent)) {
				const value = subcomponent[key];
				const propertyString = getPropertyString(key, value);

				let property = openProperties[propertyString] as PropertyStart | undefined;

				if (!property) {
					property = new PropertyStart(key, value);

					pushPropertyNode(property);
					properties.push(property);
					openProperties[propertyString] = property;
				}

				subcomponentProperties.push(property);
			}

			for (const property of subcomponentProperties) {
				property.occurrences.push(nodes.length);
			}
		}

		nodes.push(subcomponent);
	}

	Object.values(openProperties).reverse().forEach(endProperty);

	return { nodes, properties };
};

export default getPropertyRanges;