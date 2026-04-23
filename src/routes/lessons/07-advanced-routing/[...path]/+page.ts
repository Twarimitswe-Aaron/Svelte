// Load function for the rest params demo
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const path = params.path ?? '';
	return {
		path,
		segments: path.split('/').filter(Boolean)
	};
};
