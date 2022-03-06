import type { FlatTextComponent } from '../../generateFlat';
import type PropertyBoundary from './PropertyBoundary';
import type PropertyStart from './PropertyStart';
import removePropertyRange from './removePropertyRange';

/** Removes any property ranges with at most 1 occurrence, since they are useless to factor. */
const removeUselessPropertyRanges = (
	nodes: Array<FlatTextComponent | PropertyBoundary>,
	properties: PropertyStart[]
) => {
	for (const property of properties) {
		if (property.occurrences.length <= 1) {
			removePropertyRange(nodes, properties, property);
		}
	}
};

export default removeUselessPropertyRanges;