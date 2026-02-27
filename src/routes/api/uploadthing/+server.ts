import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "$lib/server/uploadthing";
import { UPLOADTHING_TOKEN } from "$env/static/private";

const handler = createRouteHandler({
  router: ourFileRouter,
  config: {
    token : UPLOADTHING_TOKEN,
  },
});

// We wrap the GET and POST to ensure the SvelteKit 'event' (which contains locals) 
// is passed into the UploadThing handler.
export const GET = (event: any) => handler(event);
export const POST = (event: any) => handler(event);