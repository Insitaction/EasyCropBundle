import { startStimulusApp } from "@symfony/stimulus-bridge";

export const app = startStimulusApp(require.context(
  "@symfony/stimulus-bridge/lazy-controller-loader!./src/Controller",
  true,
  /\.[jt]sx?$/,
));

export default app;
