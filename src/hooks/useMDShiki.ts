import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it'

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
let highlighter = null

const ready = async () => {
  md.use(await Shiki({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    langs: ['sql']
  }))
};

export function useMarkdownRenderer() {
  return {md, ready: ready()};
}