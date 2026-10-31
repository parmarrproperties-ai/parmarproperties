import NextImage, { type ImageProps } from "next/image";

import { withBasePath } from "@/lib/base-path";

/** next/image that also works for local paths like "/hero/x.jpg" under the /listing prefix. */
export default function Image({ src, ...props }: ImageProps) {
  return <NextImage src={typeof src === "string" ? withBasePath(src) : src} {...props} />;
}
