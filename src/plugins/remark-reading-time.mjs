import { toString as toStringUtil } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export default function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toStringUtil(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.readingTime = readingTime.text;
	};
}
