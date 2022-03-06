import type { JSONTextComponent } from 'sandstone';
import split from '../split';
import getSingleLineWidth from './getSingleLineWidth';

/** Gets the width in in-game pixels that a `JSONTextComponent` takes up. */
const getWidth = (component: JSONTextComponent) => {
	const lines = split(component, '\n');

	return Math.max(
		...lines.map(line => getSingleLineWidth(line))
	);
};

export default getWidth;