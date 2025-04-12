import antfu from '@antfu/eslint-config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

// export default defineConfigWithVueTs(
//   {
//     name: "app/files-to-lint",
//     files: ["**/*.{ts,mts,tsx,vue}"],
//   },

//   {
//     name: "app/files-to-ignore",
//     ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
//   },

//   pluginVue.configs["flat/recommended"],
//   vueTsConfigs.recommended,
//   {
//     rules: {
//       "vue/no-undef-components": [
//         "error",
//         {
//           ignorePatterns: [],
//         },
//       ],
//       "@typescript-eslint/no-unused-vars": "warn",
//       "@typescript-eslint/ban-ts-comment": "off",
//     },
//   },
//   antfu({
//     stylistic: {
//       indent: 4,
//       quotes: "double",
//     },
//   })
// )

export default antfu(
    {
        typescript: true,
        vue: true,
        stylistic: {
            indent: 4, // 4, or 'tab'
            quotes: 'single', // or 'double'
            semi: true,
        },
    },
    {
        rules: {
            'style/no-tabs': 'warn',
            'vue/eqeqeq': 'warn',
            'import/order': 'off',
        },
    },
);
