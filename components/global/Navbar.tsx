import Image from "next/image";

export interface NavbarProps {
  playerName: string;
  rank: number;
  avatarSeed: string;
}

function playerAvatarUrl(seed: string) {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}&backgroundColor=1a1330`;
}

export default function Navbar({ playerName, rank, avatarSeed }: NavbarProps) {
  return (
    <nav className="w-full bg-arena-bg border-b border-[0.5px] border-arena-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[#dc2626] text-sm leading-none" aria-hidden>
          ⚔
        </span>
        <span className="font-display font-extrabold text-white uppercase tracking-wider text-lg">
          MINDCLASH
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="font-display font-bold text-[11px] uppercase tracking-widest text-player-accent bg-player-accent/10 border border-player-accent/40 px-3 py-1 rounded-full"
          title={playerName}
        >
          RANK {rank}
        </span>
        <div
          className="relative w-9 h-9 rounded-full ring-2 ring-player-accent overflow-hidden shrink-0"
          title={playerName}
        >
          <Image
            src={playerAvatarUrl(avatarSeed)}
            alt={`${playerName} avatar`}
            width={36}
            height={36}
            className="w-full h-full object-cover bg-arena-surface"
            unoptimized
          />
        </div>
      </div>
    </nav>
  );
}
