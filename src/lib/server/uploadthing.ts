import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  listingImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    /* Temporarily comment this out to test! 
       If locals is undefined, this throw Error stops Step 4 from finishing.
    */
    // .middleware(async ({ locals }) => {
    //     if (!locals.user) throw new Error("Unauthorized");
    //     return { userId: locals.user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;