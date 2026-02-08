// src/routes/(app)/+layout.server.ts
export const load = ({ locals }) => {
    return {
        user: locals.user // This passes 'user' from hooks.server.ts to your .svelte files
    };
};