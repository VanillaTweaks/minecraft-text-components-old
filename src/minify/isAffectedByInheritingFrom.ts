import type { FlatTextComponent } from '../flatten';
import type { JSONTextComponent } from 'sandstone';
import type { IsAffectedByInheritingOptions } from './isAffectedByInheriting';
import getHeritableKeys from '../getHeritableKeys';
import isAffectedByInheriting from './isAffectedByInheriting';

/** Checks whether a specified `FlatTextComponent` inheriting the specified properties from another `JSONTextComponent` has a distinguishable in-game effect on the component. */
const isAffectedByInheritingFrom = (
	component: FlatTextComponent,
	inheritedComponent: JSONTextComponent,
	options: IsAffectedByInheritingOptions = {}
) => (
	isAffectedByInheriting(
		component,
		getHeritableKeys(inheritedComponent),
		options
	)
);

export default isAffectedByInheritingFrom;