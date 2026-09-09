import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Coins,
  CheckCircle2,
  X,
  Loader2,
  ShoppingCart,
  Eye,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import { SHOP_CATEGORIES, SHOP_ITEMS } from "../data/content.js";
import { usePlayerState, buyItem, equipItem, buyPowerup } from "../store/playerStore.js";

function ShopCard({ item, coins, owned, equipped, powerupCount, onBuy, onEquip, onBuyPowerup, onPreview }) {
  const Icon = Icons[item.icon] ?? Icons.Sparkles;
  const canAfford = coins >= item.price;
  const isCosmetic = ["avatars", "skins", "frames", "effects"].includes(item.category);
  const isPowerup = item.category === "powerups";

  return (
    <div
      className={`hud-frame group flex flex-col rounded-xl border p-5 transition-all ${
        equipped ? "border-neon-green/50 bg-neon-green/5" : "border-panel-line bg-panel/60 hover:border-arcane-purple/40"
      }`}
      style={{ "--hud-color": equipped ? "#4ADE80" : "#806BFF" }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPreview(item)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-arcane-purple/50 bg-arcane-purple/15 transition-transform hover:scale-110"
        >
          <Icon className="h-7 w-7 text-arcane-purple" strokeWidth={1.7} />
        </button>
        <div className="flex items-center gap-2">
          {isPowerup ? (
            powerupCount > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-reward-gold/50 bg-reward-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-reward-gold">
                x{powerupCount} owned
              </span>
            )
          ) : (
            <>
              {owned && (
                <span className="flex items-center gap-1 rounded-full border border-neon-green/50 bg-neon-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-neon-green">
                  <CheckCircle2 className="h-3 w-3" /> Owned
                </span>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="rounded-full border border-panel-line p-1.5 text-ink-faint opacity-0 transition-opacity hover:text-neon-cyan group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <h3 className="mt-3 font-display text-base font-bold text-ink-primary">{item.name}</h3>
      {item.description && (
        <p className="mt-1 font-body text-xs text-ink-muted line-clamp-2">{item.description}</p>
      )}

      <div className="mt-auto pt-4">
        {isPowerup ? (
          <button
            type="button"
            disabled={!canAfford}
            onClick={() => onBuyPowerup(item.id, item.price)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
              canAfford
                ? "bg-reward-gold text-void hover:scale-[1.02]"
                : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
            }`}
          >
            <Coins className="h-4 w-4" /> Buy for {item.price}
          </button>
        ) : owned ? (
          isCosmetic ? (
            <button
              type="button"
              onClick={() => onEquip(item.id)}
              className={`w-full rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] ${
                equipped ? "bg-neon-green text-void" : "border border-panel-line text-ink-primary hover:border-neon-cyan/60 hover:text-neon-cyan"
              }`}
            >
              {equipped ? "Equipped" : "Equip"}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 font-mono text-xs text-ink-faint">
              In inventory
            </div>
          )
        ) : (
          <button
            type="button"
            disabled={!canAfford}
            onClick={() => onBuy(item.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
              canAfford
                ? "bg-reward-gold text-void hover:scale-[1.02]"
                : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
            }`}
          >
            <Coins className="h-4 w-4" /> {item.price}
          </button>
        )}
      </div>
    </div>
  );
}

function ItemDetailModal({ item, owned, equipped, coins, onClose, onBuy, onEquip, onBuyPowerup }) {
  const [buying, setBuying] = useState(false);
  const [justBought, setJustBought] = useState(false);
  if (!item) return null;

  const Icon = Icons[item.icon] ?? Icons.Sparkles;
  const canAfford = coins >= item.price;
  const isPowerup = item.category === "powerups";
  const isCosmetic = ["avatars", "skins", "frames", "effects"].includes(item.category);

  function handleBuy() {
    if (isPowerup) {
      onBuyPowerup(item.id, item.price);
    } else {
      setBuying(true);
      setTimeout(() => {
        onBuy(item.id);
        setBuying(false);
        setJustBought(true);
        setTimeout(() => setJustBought(false), 1500);
      }, 500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl border border-panel-line bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-lg border border-panel-line p-1.5 text-ink-faint hover:text-ink-primary">
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${owned ? "border-neon-green/50 bg-neon-green/10" : "border-arcane-purple/50 bg-arcane-purple/15"}`}>
            <Icon className={`h-10 w-10 ${owned ? "text-neon-green" : "text-arcane-purple"}`} strokeWidth={1.6} />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-ink-primary">{item.name}</h2>
          {item.description && (
            <p className="mt-2 max-w-xs text-center font-body text-sm text-ink-muted">{item.description}</p>
          )}
          <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{item.category}</span>
        </div>

        <div className="mt-6 flex gap-3">
          {owned && isCosmetic && !equipped && (
            <button
              type="button"
              onClick={() => { onEquip(item.id); onClose(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              Equip Now
            </button>
          )}
          {owned && equipped && (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void">
              <CheckCircle2 className="h-4 w-4" /> Equipped
            </div>
          )}
          {!owned && (
            <button
              type="button"
              disabled={!canAfford || buying}
              onClick={handleBuy}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-display text-sm font-bold uppercase tracking-wider transition-all ${
                justBought
                  ? "bg-neon-green text-void scale-105"
                  : canAfford
                  ? "bg-reward-gold text-void hover:scale-[1.02]"
                  : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
              }`}
            >
              {buying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : justBought ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Purchased!
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" /> Buy for {item.price}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject");

  const [activeCategory, setActiveCategory] = useState("avatars");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState(null);

  const playerState = usePlayerState();
  const coins = playerState.coins;
  const ownedIds = useMemo(() => new Set(playerState.ownedItems), [playerState.ownedItems]);
  const equippedByCategory = playerState.equipped;
  const powerupCounts = playerState.powerups ?? {};

  const items = useMemo(() => {
    let filtered = SHOP_ITEMS.filter((i) => i.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q)));
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  function handleBuy(itemId) {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || ownedIds.has(itemId)) return;
    buyItem(item.id, item.price, item.category);
  }

  function handleEquip(itemId) {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    equipItem(item.id, item.category);
  }

  function handleBuyPowerup(itemId, price) {
    buyPowerup(itemId, price);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={26} />

      <SideNav active="shop" grade={grade} board={board} subject={subject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              LEARN<span className="text-neon-cyan">QUEST</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-reward-gold/50 bg-reward-gold/10 px-3 py-1.5 font-mono text-sm font-bold text-reward-gold">
              <Coins className="h-4 w-4" /> {coins}
            </div>
            <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <Link to={`/profile?class=${grade}&board=${board}`} className="hidden items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan sm:flex">
              <UserRound className="h-3.5 w-3.5" /> Profile
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-5xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-reward-gold">Shop</span>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-4xl">
              Chemist Emporium
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Spend coins earned in battle â€” no real-money purchases here.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-reward-gold/40 bg-reward-gold/10 px-4 py-2.5">
            <Coins className="h-4 w-4 text-reward-gold" />
            <span className="font-display text-lg font-bold text-reward-gold">{coins}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-reward-gold/70">coins</span>
          </div>
        </div>

        <div className="mt-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search items..." className="max-w-sm" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SHOP_CATEGORIES.map((c) => {
            const Icon = Icons[c.icon] ?? Icons.Sparkles;
            const active = activeCategory === c.id;
            const count = SHOP_ITEMS.filter((i) => i.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => { setActiveCategory(c.id); setSearchQuery(""); }}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  active
                    ? "border-arcane-purple bg-arcane-purple text-void"
                    : "border-panel-line text-ink-muted hover:text-ink-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {c.label}
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] ${active ? "bg-void/20 text-void" : "bg-panel-line/40 text-ink-faint"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              coins={coins}
              owned={ownedIds.has(item.id)}
              equipped={equippedByCategory[item.category] === item.id}
              powerupCount={powerupCounts[item.id] ?? 0}
              onBuy={handleBuy}
              onEquip={handleEquip}
              onBuyPowerup={handleBuyPowerup}
              onPreview={setPreviewItem}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-panel-line bg-panel/40 py-10 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-ink-faint" strokeWidth={1.5} />
            <p className="mt-3 font-mono text-xs text-ink-faint">
              No items found{searchQuery ? ` for "${searchQuery}"` : ""}.
            </p>
          </div>
        )}
      </div>

      <GameNav active="shop" grade={grade} board={board} subject={subject} />

      {previewItem && (
        <ItemDetailModal
          item={previewItem}
          owned={ownedIds.has(previewItem.id)}
          equipped={equippedByCategory[previewItem.category] === previewItem.id}
          coins={coins}
          onClose={() => setPreviewItem(null)}
          onBuy={handleBuy}
          onEquip={handleEquip}
          onBuyPowerup={handleBuyPowerup}
        />
      )}
    </div>
  );
}
