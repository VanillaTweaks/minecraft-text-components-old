import type { JSONTextComponent, TextComponentObject } from 'sandstone';
import minify from './minify';

/** Transforms a `JSONTextComponent` to have the specified color by default, automatically minified. */
const color = (
	colorValue: NonNullable<TextComponentObject['color']>,
	component: JSONTextComponent
) => (
	minify({
		text: '',
		color: colorValue,
		extra: [component]
	})
);

export default color;