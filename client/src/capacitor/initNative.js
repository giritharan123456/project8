import { Capacitor } from "@capacitor/core";

// Everything in here is a no-op in the browser (npm run dev / the marketing
// site build) -- it only does anything once this is actually running inside
// the Android/iOS shell added via `npm run cap:android` / `cap:ios`.
export async function initNative() {
  if (!Capacitor.isNativePlatform()) return;

  const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import("@capacitor/status-bar"),
    import("@capacitor/splash-screen"),
  ]);

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0A0C1A" });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    // setBackgroundColor is a no-op/rejects on iOS (edge-to-edge status
    // bar there is handled by contentInset instead) -- safe to ignore.
  }

  // We hide manually (rather than relying on launchAutoHide) so the splash
  // stays up through the first paint instead of the 1.5s timer in
  // capacitor.config.ts possibly beating React to first render on a slow
  // device.
  await SplashScreen.hide();
}
