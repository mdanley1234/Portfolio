/**
 * Video embeds in project content. Keeps whatever box the MDX tag asked for and
 * only defers the third-party player until it is near the viewport — an eager
 * YouTube frame pulls roughly a megabyte on page load.
 */
export default function MdxEmbed(props: React.IframeHTMLAttributes<HTMLIFrameElement>) {
  return <iframe {...props} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />;
}
