import type { JSONTextComponent } from 'sandstone';
import getWidth from './getWidth';
import center from './center';
import withContainer from './withContainer';

/** Centers a text component using its own width as the container width, automatically minified. */
const localCenter = (component: JSONTextComponent) => (
	withContainer(getWidth(component), () => (
		center(component)
	))
);

export default localCenter;