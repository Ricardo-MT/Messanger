import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...preset,
    appleSplashScreens: createAppleSplashScreens({
      darkResizeOptions: {},
    }),
  },
  images: ["public/logo-regular.svg"],
});
