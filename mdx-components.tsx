import type { MDXComponents } from "mdx/types";

// This file is required to use @next/mdx with App Router.
// It allows you to provide custom React components to be used in MDX files.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
