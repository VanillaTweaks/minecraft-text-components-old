import type { FlatTextComponent } from '../../flatten';
import type PropertyBoundary from './PropertyBoundary';
import type PropertyStart from './PropertyStart';
import adjustPropertyIndexes from './adjustPropertyIndexes';

/** Removes a property range's `PropertyBoundary`s from the `nodes` array. */
const removePropertyRange = (
	nodes: Array<FlatTextComponent | PropertyBoundary>,
	properties: PropertyStart[],
	/** The `PropertyStart` of the property range to remove. */
	property: PropertyStart
) => {
	nodes.splice(property.end.index, 1);
	nodes.splice(property.index, 1);

	adjustPropertyIndexes(properties, index => {
		if (index > property.index) {
			if (index > property.end.index) {
				// Removing `property.end` will shift this to the left.
				index--;
			}

			// Removing `property` will shift this to the left.
			index--;
		}

		return index;
	});
};

export default removePropertyRange;