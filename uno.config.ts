import presetIcons from '@unocss/preset-icons'
import {defineConfig} from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        width: "1rem",
        height: "1rem",
      }
    }),
    // ...other presets
  ],
})