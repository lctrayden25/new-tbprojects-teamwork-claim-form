import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MONGODB_URI: {
		description: 'MongoDB connection string',
	},
	TEAMWORK_API_URL: {
		description: 'Teamwork API URL for authentication',
	}
});
