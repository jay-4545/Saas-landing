import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

// ─── client ───────────────────────────────────────────────────────────────────

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-05-04",
  useCdn: process.env.NODE_ENV === "production",
});

// ─── image URL builder ────────────────────────────────────────────────────────

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// ─── types ────────────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Author {
  name: string;
  image?: SanityImage;
}

export interface Category {
  title: string;
}

// Portable Text blocks are schemaless — treat as opaque records for rendering
export type PortableTextBlock = Record<string, unknown>;

export interface PostPreview {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: Author;
  category: Category | null;
  mainImage?: SanityImage;
  excerpt: string;
}

export interface Post extends Omit<PostPreview, "excerpt"> {
  body: PortableTextBlock[];
}

// ─── GROQ queries ─────────────────────────────────────────────────────────────

// Shared projection for fields common to both list and detail views
const POST_FIELDS = /* groq */ `
  _id,
  title,
  slug,
  publishedAt,
  mainImage { ..., alt },
  "author": author->{ name, image },
  "category": category->{ title }
`;

// List view: lightweight — body omitted, excerpt derived from first text block
export const ALL_POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${POST_FIELDS},
    "excerpt": coalesce(body[0].children[0].text, "")
  }
`;

// Detail view: full body included
export const POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_FIELDS},
    body
  }
`;

// For generating static paths at build time
export const ALL_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)].slug.current
`;

// ─── fetch functions ──────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<PostPreview[]> {
  return client.fetch<PostPreview[]>(
    ALL_POSTS_QUERY,
    {},
    { next: { revalidate: 3600 } },
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(
    POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600, tags: [`post:${slug}`] } },
  );
}

export async function getAllPostSlugs(): Promise<string[]> {
  return client.fetch<string[]>(
    ALL_POST_SLUGS_QUERY,
    {},
    { next: { revalidate: 3600 } },
  );
}
