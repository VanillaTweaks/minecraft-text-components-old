import type { JSONTextComponent } from 'sandstone';
import generateMerged from './generateMerged';
import disableInheritanceIfNecessary from './disableInheritanceIfNecessary';
import generateFlat from '../generateFlat';
import generateReduced from './generateReduced';
import factorCommonProperties from './factorCommonProperties';

/** Transforms a `JSONTextComponent` to be as short and simplified as possible while keeping it indistinguishable in-game. */
const minify = (component: JSONTextComponent) => {
	let outputGenerator = generateFlat(component);
	outputGenerator = generateReduced(outputGenerator);
	outputGenerator = generateMerged(outputGenerator);

	const unfactoredOutput = [...outputGenerator];

	if (unfactoredOutput.length === 1) {
		return unfactoredOutput[0];
	}

	if (unfactoredOutput.length === 0) {
		return '';
	}

	const factoredOutput = factorCommonProperties(unfactoredOutput);

	if (factoredOutput.length === 1) {
		return factoredOutput[0];
	}

	const output = disableInheritanceIfNecessary(factoredOutput);

	return output;
};

export default minify;