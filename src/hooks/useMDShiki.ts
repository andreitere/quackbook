import { fromHighlighter } from "@shikijs/markdown-it";
import { createSharedComposable } from "@vueuse/core";
import MarkdownIt from "markdown-it";
import { createHighlighterCore, createOnigurumaEngine } from "shiki";

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

async function ready() {
  const highlighter = await createHighlighterCore({
    themes: [
      // @ts-ignore
      import("shiki/themes/vitesse-light"),
      // @ts-ignore
      import("shiki/themes/vitesse-dark"),
    ],
    langs: [
      // @ts-ignore
      import("shiki/langs/sql"),
    ],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
  });
  md.use(
    // @ts-ignore
    fromHighlighter(highlighter, {
      theme: "vitesse-light",
    })
  );
}

export const useMDRenderer = createSharedComposable(() => {
  return { md, ready: ready() };
});
