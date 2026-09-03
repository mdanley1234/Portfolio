import { visit } from 'unist-util-visit';

/**
 * Literal `<img>` and `<iframe>` tags written inside MDX are parsed as JSX
 * elements, so they bypass the `components` map that markdown-authored nodes go
 * through. Renaming them here routes every image and embed in project content
 * through the shared components regardless of how it was written.
 */
const RENAME = { img: 'MdxImage', iframe: 'MdxEmbed' };

export default function remarkMdxElements() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
      const replacement = RENAME[node.name];
      if (replacement) node.name = replacement;
    });
  };
}
