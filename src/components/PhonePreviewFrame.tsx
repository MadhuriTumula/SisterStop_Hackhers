import { useLocation } from "react-router-dom";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

/**
 * Renders the app inside a real iframe rather than a narrow div.
 *
 * That matters: CSS media queries resolve against the *viewport*, and an
 * iframe has its own. A 390px-wide div would show desktop-breakpoint styles
 * squeezed into a phone-width column — which is not what the phone shows. The
 * iframe gives the genuine mobile layout, bottom nav and safe-area padding
 * included.
 */

const SIZES = [
  { id: "iphone", label: "iPhone 15", width: 393, height: 852 },
  { id: "pixel", label: "Pixel 8", width: 412, height: 915 },
  { id: "mini", label: "iPhone SE", width: 375, height: 667 },
] as const;

const PhonePreviewFrame = () => {
  const { pathname } = useLocation();
  const [sizeId, setSizeId] = useState<(typeof SIZES)[number]["id"]>("iphone");
  const [reloadKey, setReloadKey] = useState(0);

  const size = SIZES.find((option) => option.id === sizeId) ?? SIZES[0];

  // `phone=1` tells the framed instance to hide this control, so the preview
  // cannot open a preview inside itself.
  const src = `${pathname}?phone=1`;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div
          role="radiogroup"
          aria-label="Preview device"
          className="flex items-center gap-0.5 rounded-full border border-hairline bg-elevated/70 p-0.5"
        >
          {SIZES.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={option.id === sizeId}
              onClick={() => setSizeId(option.id)}
              className={cn(
                "min-h-8 rounded-full px-3 text-xs font-medium transition-colors",
                option.id === sizeId
                  ? "bg-brand/15 text-brand-soft ring-1 ring-inset ring-brand/40"
                  : "text-muted hover:text-paper",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn-ghost h-8 px-3 text-xs"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Reload
        </button>

        <span className="chip bg-elevated text-muted ring-hairline">
          {size.width} × {size.height}
        </span>
      </div>

      {/* Device bezel. Purely cosmetic, but it reads as a phone on a slide. */}
      <div
        className="rounded-[2.6rem] border border-hairline bg-elevated p-3 shadow-2xl shadow-black/40"
        style={{ width: size.width + 24 }}
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink"
          />
          <iframe
            key={`${size.id}-${reloadKey}-${pathname}`}
            src={src}
            title={`SisterStop preview at ${size.width} by ${size.height} pixels`}
            width={size.width}
            height={size.height}
            className="block border-0"
          />
        </div>
      </div>

      <p className="max-w-sm text-center text-xs leading-relaxed text-muted">
        The real mobile layout, not a narrowed desktop one — the frame is its own
        viewport, so breakpoints, the bottom nav, and safe-area padding all behave
        as they do on a phone. Sign-in opens in the main window.
      </p>
    </div>
  );
};

export default PhonePreviewFrame;
