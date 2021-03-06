import type { FlatTextComponent } from '../../generateFlat';
import type PropertyBoundary from './PropertyBoundary';
import type PropertyStart from './PropertyStart';
import splitPropertyRange from './splitPropertyRange';

/** Splits properties that straddle the boundaries of more costly properties. */
const splitPropertyRanges = (
	nodes: Array<FlatTextComponent | PropertyBoundary>,
	properties: PropertyStart[]
) => {
	const tentativeProperties = new Set<PropertyStart>(properties);
	while (tentativeProperties.size) {
		const tentativePropertyIterator = tentativeProperties.values();

		/** The most costly element of `tentativeProperties`. */
		let greatestProperty = tentativePropertyIterator.next().value;

		for (const property of tentativePropertyIterator) {
			if (property.cost > greatestProperty.cost) {
				greatestProperty = property;
			}
		}

		/** The `PropertyStart` of each property which straddles the `greatestProperty`'s start boundary. */
		const startStraddlers: PropertyStart[] = [];
		/** The `PropertyStart` of each property which straddles the `greatestProperty`'s end boundary. */
		const endStraddlers: PropertyStart[] = [];

		for (const property of tentativeProperties) {
			if (property.index < greatestProperty.index) {
				if (
					property.end.index > greatestProperty.index
					&& property.end.index < greatestProperty.end.index
				) {
					startStraddlers.push(property);
				}
			} else if (
				property.index < greatestProperty.end.index
				&& property.end.index > greatestProperty.end.index
			) {
				endStraddlers.push(property);
			}
		}

		for (const property of startStraddlers) {
			const rightProperty = splitPropertyRange(nodes, properties, property, greatestProperty.index);
			tentativeProperties.add(rightProperty);
		}

		for (const property of endStraddlers) {
			const rightProperty = splitPropertyRange(nodes, properties, property, greatestProperty.end.index);
			tentativeProperties.add(rightProperty);
		}

		// The `greatestProperty` is no longer tentative.
		tentativeProperties.delete(greatestProperty);
	}
};

export default splitPropertyRanges;