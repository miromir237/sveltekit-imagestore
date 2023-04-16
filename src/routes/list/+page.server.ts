import type { PageServerLoad } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {      
    // if page is undefined, return 302 redirect to /list/1
    if (params) {
        throw redirect(302,'/list/1');
    }
};
