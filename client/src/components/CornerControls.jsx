import ThemeToggle from "./ThemeToggle.jsx";

/**
 * Fixed top-right corner cluster: light/dark toggle only. Sign-out now
 * lives solely in the SideNav (bottom of the primary nav list) so it
 * isn't duplicated in two places.
 */
export default function CornerControls() {
  return (
    <div className="fixed right-4 top-4 z-40 flex items-center gap-2 sm:right-6 sm:top-6">
      <ThemeToggle />
    </div>
  );
}
