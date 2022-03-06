import PropertyBoundary from './PropertyBoundary';
import type PropertyStart from './PropertyStart';

export default class PropertyEnd extends PropertyBoundary {
	/** The `PropertyStart` which this marks the end of. */
	readonly start: PropertyStart;

	/** Marks the end of a series of consecutive subcomponents which are unaffected by a property. */
	constructor(start: PropertyStart) {
		super();

		this.start = start;
	}
}