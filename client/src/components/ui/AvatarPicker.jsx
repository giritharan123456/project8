import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { X, Check, Lock, Coins, Loader2 } from "lucide-react";
import { SHOP_ITEMS } from "../../data/content.js";
import { usePlayerState, equipItem, buyItem } from "../../store/playerStore.js";

const AVATARS = SHOP_ITEMS.filter((i) => i.category === "avatars");

export default function AvatarPicker({ open, onClose }) {
  const playerState = usePlayerState();
  const ownedIds = useMemo(() => new Set(playerState.ownedItems), [playerState.ownedItems]);
  const coins = playerState.coins;
  const equippedId = playerState.equipped?.avatars;
  const [previewId, setPreviewId] = useState(equippedId);
  const [buying, setBuying] = useState(false);

  const previewItem = AVATARS.find((a) => a.id === previewId) ?? AVATARS[0];

  if (!open) return null;

  function handleEquip(id) {
    const item = AVATARS.find((a) => a.id === id);
    if (!item || !ownedIds.has(id)) return;
    equipItem(id, "avatars");
  }

  function handleBuy(id) {
    const item = AVATARS.find((a) => a.id === id);
    if (!item || ownedIds.has(id) || coins < item.price) return;
    setBuying(true);
    setTimeout(() => {
      buyItem(id, item.price, "avatars");
      setBuying(false);
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl border border-panel-line bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-panel-line p-1.5 text-ink-faint hover:text-ink-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">
          Avatar Picker
        </span>
        <h2 className="mt-1 font-display text-xl font-bold text-ink-primary">Choose Your Avatar</h2>

        {/* Preview */}
        {previewItem && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-arcane-purple/60 bg-arcane-purple/15">
              {(() => {
                const PreviewIcon = Icons[previewItem.icon] ?? Icons.UserRound;
                return <PreviewIcon className="h-10 w-10 text-arcane-purple" strokeWidth={1.6} />;
              })()}
            </div>
          </div>
        )}
        {previewItem && (
          <p className="mt-2 text-center font-display text-sm font-semibold text-ink-primary">
            {previewItem.name}
          </p>
        )}

        {/* Grid */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {AVATARS.map((av) => {
            const Icon = Icons[av.icon] ?? Icons.UserRound;
            const owned = ownedIds.has(av.id);
            const equipped = equippedId === av.id;
            const selected = previewId === av.id;
            const canAfford = coins >= av.price;

            return (
              <button
                key={av.id}
                type="button"
                onClick={() => setPreviewId(av.id)}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  selected
                    ? "border-arcane-purple bg-arcane-purple/15"
                    : "border-panel-line bg-panel/50 hover:border-panel-line/80"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                    owned ? "border-arcane-purple/50 bg-arcane-purple/10" : "border-panel-line bg-panel-line/20"
                  }`}
                >
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={1.7}
                    style={{ color: owned ? "#806BFF" : "#6B6088" }}
                  />
                </div>
                {owned ? (
                  equipped ? (
                    <span className="flex items-center gap-0.5 font-mono text-[9px] uppercase text-neon-green">
                      <Check className="h-2.5 w-2.5" /> Equipped
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] uppercase text-ink-faint">Owned</span>
                  )
                ) : (
                  <span className="flex items-center gap-0.5 font-mono text-[9px] text-reward-gold">
                    <Coins className="h-2.5 w-2.5" /> {av.price}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          {previewItem && ownedIds.has(previewItem.id) && equippedId !== previewItem.id && (
            <button
              type="button"
              onClick={() => handleEquip(previewItem.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-cyan py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              <Check className="h-4 w-4" /> Equip
            </button>
          )}
          {previewItem && !ownedIds.has(previewItem.id) && (
            <button
              type="button"
              disabled={coins < previewItem.price || buying}
              onClick={() => handleBuy(previewItem.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
                coins >= previewItem.price
                  ? "bg-reward-gold text-void hover:scale-[1.02]"
                  : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
              }`}
            >
              {buying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Coins className="h-4 w-4" /> Buy for {previewItem.price}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
