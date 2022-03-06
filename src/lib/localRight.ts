import type { JSONTextComponent } from 'sandstone';
import getWidth from './getWidth';
import right from './right';
import withContainer from './withContainer';

/** Right-aligns a text component using its own width as the container width, automatically minified. */
const localRight = (component: JSONTextComponent) => (
	withContainer(getWidth(component), () => (
		right(component)
	))
);

export default localRight;