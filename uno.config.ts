import presetIcons from "@unocss/preset-icons";
import { defineConfig } from "unocss";
import { animatedUno } from "animated-unocss";

export default defineConfig({
	presets: [
		presetIcons({
			extraProperties: {
				width: "1rem",
				height: "1rem",
			},
		}),
		animatedUno(),
		// ...other presets
	],
});
