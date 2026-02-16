import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import remarkReadingTime from "./src/plugins/remark-reading-time.mjs";

import cloudflare from "@astrojs/cloudflare";

const rehypePrettyCodeOptions = {
	theme: "dracula",
	onVisitLine(node) {
		if (node.children.length === 0) {
			node.children = [
				{
					type: "text",
					value: " ",
				},
			];
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className.push("highlighted");
	},
	onVisitHighlightedWord(node) {
		node.properties.className = ["word"];
	},
};

// https://astro.build/config
export default defineConfig({
	site: "https://abdufelsayed.dev",
	integrations: [preact({ compat: true }), mdx(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},

	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
		remarkPlugins: [remarkReadingTime],
	},

	adapter: cloudflare(),
});
