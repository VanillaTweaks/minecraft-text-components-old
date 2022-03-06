import type { JSONTextComponent } from 'sandstone';
import padEachLine from './padEachLine';
import { containerWidth } from './withContainer';

/** Right-aligns a text component, automatically minified. */
const right = (component: JSONTextComponent) => (
	padEachLine(
		component,
		width => containerWidth - width
	)
);

export default right;