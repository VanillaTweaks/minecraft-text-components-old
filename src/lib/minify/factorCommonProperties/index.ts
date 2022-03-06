import type { FlatTextComponent } from '../../generateFlat';
import getPropertyRanges from './getPropertyRanges';
import splitPropertyRanges from './splitPropertyRanges';
import removeUselessPropertyRanges from './removeUselessPropertyRanges';
import getFactoredOutput from './getFactoredOutput';

/**
 * Wraps certain ranges of subcomponents into arrays, utilizing array inheritance to reduce the number of properties in the wrapped subcomponents.
 *
 * ⚠️ Only for use in `minify`. May mutate the inputted subcomponents.
 *
 * Example:
 *
 * ```
 * minify([
 * 	{ text: 'a', color: 'red' },
 * 	{ text: 'b', color: 'green' },
 * 	{ text: 'c', color: 'blue' },
 * 	{ text: 'd', color: 'green' }
 * ]) === [
 * 	{ text: 'a', color: 'red' },
 * 	[
 * 		{ text: 'b', color: 'green' },
 * 		{ text: 'c', color: 'blue' },
 * 		'd'
 * 	]
 * ]
 * ```
 */
const factorCommonProperties = (subcomponents: FlatTextComponent[]) => {
	const { nodes, properties } = getPropertyRanges(subcomponents);

	splitPropertyRanges(nodes, properties);

	// Ideally, this would properly handle overlapping (but non-straddling) property ranges with the same key, but I couldn't figure out any good algorithm for that faster than exponential time.

	removeUselessPropertyRanges(nodes, properties);

	return getFactoredOutput(nodes);
};

export default factorCommonProperties;