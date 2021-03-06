import PropertyBoundary from './PropertyBoundary';
import type { HeritableKey } from '../../heritableKeys';
import PropertyEnd from './PropertyEnd';
import type { PropertyString } from './getPropertyString';
import getPropertyString from './getPropertyString';

export default class PropertyStart extends PropertyBoundary {
	readonly key: HeritableKey;
	readonly value: unknown;

	/** A string that both uniquely identifies a property and represents the number of characters which a single instance of that property generally requires via its length. */
	readonly string: PropertyString;
	/** The typical number of characters required by a single instance of this property. */
	readonly size: number;

	/** The `PropertyEnd` which this marks the start of. */
	readonly end = new PropertyEnd(this);

	/** Marks the start of a series of consecutive subcomponents which are unaffected by a property. */
	constructor(
		key: PropertyStart['key'],
		value: PropertyStart['value']
	) {
		super();

		this.key = key;
		this.value = value;

		this.string = getPropertyString(key, value);
		this.size = this.string.length;
	}

	/** An ordered array of subcomponent indexes in the `nodes` array at which this property is present. */
	readonly occurrences: number[] = [];

	/** The approximate total number of the characters required by this property throughout all adjacent subcomponents. */
	get cost() {
		return this.occurrences.length * this.size;
	}
}