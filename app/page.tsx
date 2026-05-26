"use client";

import { Component, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/global/Navbar";
import AvatarSelector from "@/components/screen-1-lobby/AvatarSelector";
import MatchConfig from "@/components/screen-1-lobby/MatchConfig";
import TopicReveal from "@/components/screen-1-lobby/TopicReveal";
import ControlPanel from "@/components/screen-2-arena/ControlPanel";
import CrowdBackdrop from "@/components/screen-2-arena/CrowdBackdrop";
import DialogueFeed, {
  type DialogueMessage,
} from "@/components/screen-2-arena/DialogueFeed";
import HealthBars from "@/components/screen-2-arena/HealthBars";
import RoundReaction from "@/components/screen-2-arena/RoundReaction";
import EvaluationRadar from "@/components/screen-3-analysis/EvaluationRadar";
import RefereeCritique from "@/components/screen-3-analysis/RefereeCritique";
import ScoreCard from "@/components/screen-3-analysis/ScoreCard";
import { CHARACTERS, getCharacter } from "@/lib/characters";
import type { DebateDifficulty } from "@/lib/topicEngine";
import { useDebateState } from "@/hooks/useDebateState";

const PLAYER = {
  name: "GLADIATOR",
  rank: 1,
  avatarSeed: "player1",
};

const UNLOCKED_BY_DIFFICULTY: Record<DebateDifficulty, string[]> = {
  NOVICE: ["empiricist", "nihilist", "hyperrealist"],
  CHALLENGER: [
    "empiricist",
    "nihilist",
    "hyperrealist",
    "contrarian",
    "steelman",
  ],
  BRUTAL: CHARACTERS.map((c) => c.id),
};

class ArenaErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-arena-bg px-6 text-center">
          <p className="font-display font-extrabold text-ai-accent text-xl uppercase mb-2">
            Arena Malfunction
          </p>
          <p className="font-body text-arena-muted text-sm mb-6">
            Combat systems crashed. Reload to re-enter the colosseum.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg border border-player-accent text-player-accent hover:bg-player-accent/10"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MindClashApp() {
  const debate = useDebateState();
  const [showReaction, setShowReaction] = useState(false);
  const [reactionDamage, setReactionDamage] = useState({
    playerDamageDealt: 0,
    playerDamageTaken: 0,
  });

  const character = useMemo(
    () =>
      debate.characterId ? getCharacter(debate.characterId) : undefined,
    [debate.characterId]
  );

  const unlockedIds = UNLOCKED_BY_DIFFICULTY[debate.difficulty];

  const dialogueMessages: DialogueMessage[] = useMemo(
    () =>
      debate.messages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("ai" as const),
        content: m.content,
        reactionTag: m.reactionTag,
      })),
    [debate.messages]
  );

  const avgLogicScore =
    debate.allRoundMetrics.length > 0
      ? debate.allRoundMetrics.reduce((s, m) => s + m.logicScore, 0) /
        debate.allRoundMetrics.length
      : 0;

  const won =
    !debate.withdrawn &&
    (debate.playerHP > debate.aiHP || debate.aiHP <= 0);

  useEffect(() => {
    if (debate.lastRoundDamage) {
      setReactionDamage(debate.lastRoundDamage);
      setShowReaction(true);
    }
  }, [debate.lastRoundDamage]);

  const handleDismissReaction = useCallback(() => {
    setShowReaction(false);
    debate.clearRoundReaction();
  }, [debate]);

  return (
    <div className="min-h-screen flex flex-col bg-arena-bg">
      <Navbar
        playerName={PLAYER.name}
        rank={PLAYER.rank}
        avatarSeed={PLAYER.avatarSeed}
      />

      {debate.phase === "config" && (
        <main className="flex-1">
          <MatchConfig onConfirm={debate.configureMatch} />
        </main>
      )}

      {debate.phase === "reveal" && debate.topic && (
        <main className="flex-1">
          <TopicReveal
            topic={debate.topic}
            difficulty={debate.difficulty}
            onAccept={debate.acceptTopicReveal}
          />
        </main>
      )}

      {debate.phase === "character-select" && (
        <main className="flex-1">
          {debate.topic && (
            <p className="px-6 pt-8 font-body text-sm text-arena-muted text-center max-w-3xl mx-auto">
              Motion: &ldquo;{debate.topic}&rdquo;
            </p>
          )}
          <AvatarSelector
            unlockedIds={unlockedIds}
            onSelect={debate.selectCharacter}
          />
        </main>
      )}

      {debate.phase === "arena" && character && (
        <main className="relative flex-1 flex flex-col min-h-0">
          <CrowdBackdrop />

          <div
            className="pointer-events-none absolute top-24 left-8 w-[300px] h-[300px] z-0"
            style={{
              background:
                "radial-gradient(circle, #a78bfa08 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-24 right-8 w-[300px] h-[300px] z-0"
            style={{
              background:
                "radial-gradient(circle, #f8717108 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <HealthBars
            playerHP={debate.playerHP}
            aiHP={debate.aiHP}
            round={Math.min(debate.round, debate.maxRounds)}
            maxRounds={debate.maxRounds}
            playerName={PLAYER.name}
            playerRank={PLAYER.rank}
            playerAvatarSeed={PLAYER.avatarSeed}
            characterId={character.id}
            characterName={character.name}
          />

          <section className="relative z-10 flex-1 min-h-0 px-6 py-6 max-w-4xl mx-auto w-full flex flex-col gap-4">
            <div className="bg-arena-bg/80 border border-arena-border rounded-lg px-4 py-3 text-center shrink-0">
              <span className="font-body text-[10px] uppercase tracking-widest text-arena-muted block mb-1">
                Current Motion
              </span>
              <p className="font-display font-bold text-white text-sm md:text-base leading-snug">
                &ldquo;{debate.topic}&rdquo;
              </p>
            </div>
            <DialogueFeed
              messages={dialogueMessages}
              isLoading={debate.isLoading}
              characterName={character.name}
              characterAccent={character.accent}
              playerAvatarSeed={PLAYER.avatarSeed}
              characterId={character.id}
            />
          </section>

          <ControlPanel
            onSubmit={debate.submitArgument}
            isLoading={debate.isLoading}
            refereeSummaryLine={debate.refereeSummaryLine}
            round={Math.min(debate.round, debate.maxRounds)}
            maxRounds={debate.maxRounds}
            topic={debate.topic}
            onWithdraw={debate.withdrawFromMatch}
          />

          <RoundReaction
            show={showReaction}
            playerDamageDealt={reactionDamage.playerDamageDealt}
            playerDamageTaken={reactionDamage.playerDamageTaken}
            onDismiss={handleDismissReaction}
          />
        </main>
      )}

      {debate.phase === "analysis" && character && (
        <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full flex flex-col gap-8">
          <ScoreCard
            won={won}
            withdrawn={debate.withdrawn}
            playerHP={debate.playerHP}
            roundsWon={debate.roundsWon}
            avgLogicScore={avgLogicScore}
            totalDamageDealt={debate.totalDamageDealt}
            characterName={character.name}
          />
          <EvaluationRadar roundMetrics={debate.allRoundMetrics} />
          <RefereeCritique
            critiqueText={debate.critiqueText}
            onRematch={debate.rematch}
            onChangeOpponent={debate.goToCharacterSelect}
          />
        </main>
      )}
    </div>
  );
}

export default function MindClashPage() {
  return (
    <ArenaErrorBoundary>
      <MindClashApp />
    </ArenaErrorBoundary>
  );
}
