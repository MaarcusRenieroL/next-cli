import { privateProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

// Simple in-memory database
let posts = [
  { id: 1, title: "First Post", content: "Hello, world!" },
  { id: 2, title: "Second Post", content: "TRPC is awesome!" },
];

export const postRouter = router({
  // Get all posts
  getAll: publicProcedure.query(() => {
    return posts;
  }),

  // Get a single post by ID
  getById: publicProcedure.input(z.number()).query(({ input }) => {
    const post = posts.find((p) => p.id === input);
    if (!post) throw new Error("Post not found");
    return post;
  }),

  // Create a new post
  create: privateProcedure.input(z.object({ title: z.string().trim().min(1).max(120), content: z.string().trim().min(1).max(5000) })).mutation(({ input }) => {
    const newPost = { id: posts.length + 1, ...input };
    posts.push(newPost);
    return newPost;
  }),

  // Update an existing post
  update: privateProcedure
    .input(z.object({ id: z.number().int().positive(), title: z.string().trim().min(1).max(120), content: z.string().trim().min(1).max(5000) }))
    .mutation(({ input }) => {
      const index = posts.findIndex((p) => p.id === input.id);
      if (index === -1) throw new Error("Post not found");
      posts[index] = { ...posts[index], ...input };
      return posts[index];
    }),

  // Delete a post
  delete: privateProcedure.input(z.number().int().positive()).mutation(({ input }) => {
    const index = posts.findIndex((p) => p.id === input);
    if (index === -1) throw new Error("Post not found");
    const deletedPost = posts[index];
    posts = posts.filter((p) => p.id !== input);
    return deletedPost;
  }),
});
