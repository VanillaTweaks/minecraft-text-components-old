import type { FlatTextComponent } from '../../generateFlat';
import generateFlat from '../../generateFlat';
import PropertyBoundary from './PropertyBoundary';
import PropertyStart from './PropertyStart';
import generateReduced from '../generateReduced';
import generateMerged from '../generateMerged';
import type { HeritableKey } from '../../heritableKeys';
import getHeritableKeys from '../../getHeritableKeys';
import getHeritableProperties from '../../getHeritableProperties';
import isAffectedByInheriting from '../isAffectedByInheriting';

export type FactoredComponent = FlatTextComponent | FactoredComponent[];

const getFactoredOutput = (nodes: Array<FlatTextComponent | PropertyBoundary>) => {
	/** The current working descendent array. */
	let currentArray: FactoredComponent[] = [];
	/** The stack of current arrays from ancestor to descendant. */
	const ancestorArrays: FactoredComponent[][] = [currentArray];
	/** The stack of current property ranges from ancestor to descendant. */
	const ancestorProperties: PropertyStart[] = [];
	/** Each number in this array corresponds to that number of properties in the `ancestorProperties` array which start and end at the same place. */
	const simultaneousPropertyCounts: number[] = [];

	/** A function which should be called at the end of every `currentArray`'s creation. */
	const endCurrentArray = () => {
		// Try to merge the `firstSubcomponent` and the `inheritedElement`.

		const inheritedElement = currentArray[0];

		if (
			typeof inheritedElement === 'object'
			&& 'text' in inheritedElement
			&& inheritedElement.text === ''
		) {
			const firstSubcomponent = currentArray[1];

			let mergedElement: FactoredComponent;

			if (typeof firstSubcomponent === 'object') {
				const heritableKeys = getHeritableKeys(firstSubcomponent);

				if (heritableKeys.length) {
					// Ensure the `inheritedElement`'s heritable properties wouldn't overwrite the `firstSubcomponent`'s properties, or else they can't merge.
					if (heritableKeys.some(key => key in inheritedElement)) {
						return;
					}

					// Ensure the `firstSubcomponent`'s properties wouldn't affect the other subcomponents in the `currentArray`, or else it shouldn't merge.
					for (let i = 2; i < currentArray.length; i++) {
						const subcomponent = currentArray[i];

						for (const flatSubcomponent of generateFlat(subcomponent)) {
							if (isAffectedByInheriting(flatSubcomponent, heritableKeys)) {
								return;
							}
						}
					}
				}

				// The `firstSubcomponent` can merge with the `inheritedElement`.

				mergedElement = Object.assign(
					// If the first element of an outer array could be another inner array, then the outer array's other elements would inherit the heritable properties of the inner array's first element. In that case, the outer array's other elements could equivalently be included in the inner array instead, which is what `factorCommonProperties` would necessarily do. Thus, it's impossible for the `firstSubcomponent` to be mergeable with the `inheritedElement` and also be an array. Because we've already verified they can merge, we can assert `firstSubcomponent` as not an array.
					firstSubcomponent as Exclude<typeof firstSubcomponent, any[]>,
					getHeritableProperties(inheritedElement)
				);
			} else {
				// The `firstSubcomponent` is plain text and would inherit all properties of the `inheritedElement`, so they can be merged.
				inheritedElement.text = firstSubcomponent;
				mergedElement = inheritedElement;
			}

			// Replace the `inheritedElement` and the `firstSubcomponent` with the `mergedElement`.
			currentArray.splice(0, 2, mergedElement);
		}
	};

	let consecutiveSubcomponents: FlatTextComponent[] | undefined;

	/** Reduces and merges the `consecutiveSubcomponents` and pushes them to the `currentArray`. */
	const endConsecutiveSubcomponents = () => {
		if (consecutiveSubcomponents) {
			let subcomponentGenerator = generateReduced(consecutiveSubcomponents);
			subcomponentGenerator = generateMerged(subcomponentGenerator);

			currentArray.push(...subcomponentGenerator);

			consecutiveSubcomponents = undefined;
		}
	};

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];

		if (node instanceof PropertyBoundary) {
			endConsecutiveSubcomponents();

			if (node instanceof PropertyStart) {
				const inheritedElement = {
					text: '',
					[node.key]: node.value
				};
				const newCurrentArray = [inheritedElement];

				currentArray.push(newCurrentArray);
				ancestorArrays.push(newCurrentArray);
				ancestorProperties.push(node);

				let simultaneousPropertyCount = 1;

				let previousSimultaneousProperty = node;
				while (true) {
					const nextNode = nodes[i + 1];
					if (
						nextNode instanceof PropertyStart
						&& nextNode.end.index === previousSimultaneousProperty.end.index - 1
					) {
						// The `nextNode` is simultaneous with the `previousSimultaneousProperty`, meaning it ends and starts at the same place.

						simultaneousPropertyCount++;

						Object.assign(inheritedElement, {
							[nextNode.key]: nextNode.value
						});

						ancestorProperties.push(nextNode);

						// We've processed the `nextNode`, so we can skip it.
						i++;

						previousSimultaneousProperty = nextNode;
					} else {
						break;
					}
				}

				simultaneousPropertyCounts.push(simultaneousPropertyCount);

				currentArray = newCurrentArray;
			} else {
				endCurrentArray();

				let propertyCount = simultaneousPropertyCounts.pop()!;

				// Skip past the ends of all simultaneous properties.
				i += propertyCount - 1;

				while (propertyCount--) {
					ancestorProperties.pop();
				}

				ancestorArrays.pop();
				currentArray = ancestorArrays[ancestorArrays.length - 1];
			}
		} else {
			if (consecutiveSubcomponents === undefined) {
				consecutiveSubcomponents = [];
			}

			if (typeof node === 'object') {
				// Remove all properties which this subcomponent inherits from its ancestor arrays.

				const inheritedKeys: Partial<Record<HeritableKey, true>> = {};

				// Iterate through the `ancestorProperties` backward since the last elements are the deepest and would thus have the highest inheritance priority.
				for (let i = ancestorProperties.length - 1; i >= 0; i--) {
					const property = ancestorProperties[i];

					if (inheritedKeys[property.key]) {
						// Don't delete a subcomponent's property if a different value from a higher-priority property with the same key would otherwise affect the subcomponent.
						continue;
					}
					// This property has the highest priority for its key because it's the deepest of the `ancestorProperties` with that key.
					inheritedKeys[property.key] = true;

					if (
						property.key in node
						&& JSON.stringify(node[property.key]) === JSON.stringify(property.value)
					) {
						delete node[property.key];
					}
				}
			}

			consecutiveSubcomponents.push(node);
		}
	}

	endConsecutiveSubcomponents();
	endCurrentArray();

	return currentArray;
};

export default getFactoredOutput;