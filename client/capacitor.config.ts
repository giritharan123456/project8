import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.chemquest.app",
  appName: "ChemQuest",
  webDir: "dist",
  // The app boots into the world map / dashboard shell, not the marketing
  // landing page, once wrapped as a native app (mirrors manifest start_url).
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0A0C1A",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0A0C1A",
      // Fixed top-anchored elements (Navbar, CornerControls) don't pad for
      // env(safe-area-inset-top) the way GameNav pads for the bottom inset,
      // so keep the status bar out of the WebView's box rather than
      // overlaying it (which is the Capacitor default).
      overlaysWebView: false,
    },
  },
  android: {
    backgroundColor: "#0A0C1A",
  },
  ios: {
    backgroundColor: "#0A0C1A",
    contentInset: "always",
  },
};

export default config;
