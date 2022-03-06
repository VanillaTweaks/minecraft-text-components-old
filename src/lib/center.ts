import type { JSONTextComponent } from 'sandstone';
import padEachLine from './padEachLine';
import { containerWidth } from './withContainer';

/** Centers a text component, automatically minified. */
const center = (component: JSONTextComponent) => (
	padEachLine(
		component,
		width => (containerWidth - width) / 2
	)
);

export default center;