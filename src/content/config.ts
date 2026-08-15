import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.string(),
    products: z
      .array(
        z.object({
          name: z.string(),
          priceRange: z.string(),
          pros: z.array(z.string()),
          cons: z.array(z.string()),
          affiliateUrl: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { articulos };
