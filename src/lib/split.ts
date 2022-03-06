import type { JSONTextComponent } from 'sandstone';
import type { SeparatorOrSplitFunction } from './generateSplit';
import generateSplit from './generateSplit';

/**
 * Splits a `JSONTextComponent` into an array of multiple `JSONTextComponent`s.
 *
 * The returned array is never empty.
 */
const split = (
	component: JSONTextComponent,
	/** The pattern on which each split should occur, or a function that takes a string and returns the string split into an array. */
	separatorOrSplitFunction: SeparatorOrSplitFunction
) => [
	...generateSplit(component, separatorOrSplitFunction)
];

export default split;