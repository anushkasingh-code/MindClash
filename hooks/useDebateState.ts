"use client";

import { useCallback, useState } from "react";
import {
  generateMatchTopic,
  type DebateDifficulty,
} from "@/lib/topicEngine";

export type { DebateDifficulty };

interface Message {
  role: "user" | "model";
  content: string;
  reactionTag?: string;
  refereeSummaryLine?: string;
}

interface Metrics {
  logicScore: number;
  evidenceScore: number;
  clarityScore: number;
}

export interface LastRoundDamage {
  playerDamageDealt: number;
  playerDamageTaken: number;
}

interface DebateState {
  phase: "config" | "reveal" | "character-select" | "arena" | "analysis";
  topic: string;
  difficulty: DebateDifficulty;
  characterId: string;
  playerHP: number;
  aiHP: number;
  round: number;
  maxRounds: number;
  messages: Message[];
  isLoading: boolean;
  lastMetrics: Metrics | null;
  allRoundMetrics: Metrics[];
  roundsWon: number;
  totalDamageDealt: number;
  critiqueText: string;
  isGameOver: boolean;
  refereeSummaryLine: string;
  withdrawn: boolean;
  lastRoundDamage: LastRoundDamage | null;
}

const INITIAL_STATE: DebateState = {
  phase: "config",
  topic: "",
  difficulty: "NOVICE",
  characterId: "",
  playerHP: 100,
  aiHP: 100,
  round: 1,
  maxRounds: 5,
  messages: [],
  isLoading: false,
  lastMetrics: null,
  allRoundMetrics: [],
  roundsWon: 0,
  totalDamageDealt: 0,
  critiqueText: "",
  isGameOver: false,
  refereeSummaryLine: "",
  withdrawn: false,
  lastRoundDamage: null,
};

export function useDebateState() {
  const [state, setState] = useState<DebateState>(INITIAL_STATE);

  const configureMatch = useCallback(
    (difficulty: DebateDifficulty, rounds: number) => {
      const generated = generateMatchTopic(difficulty, rounds);
      setState({
        ...INITIAL_STATE,
        difficulty,
        maxRounds: rounds,
        topic: generated.text,
        phase: "reveal",
      });
    },
    []
  );

  const acceptTopicReveal = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "character-select" }));
  }, []);

  const selectCharacter = useCallback((characterId: string) => {
    setState((prev) => ({
      ...prev,
      characterId,
      phase: "arena",
      playerHP: 100,
      aiHP: 100,
      round: 1,
      messages: [],
      isLoading: false,
      lastMetrics: null,
      allRoundMetrics: [],
      roundsWon: 0,
      totalDamageDealt: 0,
      critiqueText: "",
      isGameOver: false,
      refereeSummaryLine: "",
      withdrawn: false,
      lastRoundDamage: null,
    }));
  }, []);

  const goToCharacterSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "character-select",
      withdrawn: false,
    }));
  }, []);

  const clearRoundReaction = useCallback(() => {
    setState((prev) => ({ ...prev, lastRoundDamage: null }));
  }, []);

  const triggerEndGame = useCallback(
    async (
      finalPlayerHP: number,
      finalAiHP: number,
      snapshot: Pick<
        DebateState,
        | "topic"
        | "characterId"
        | "messages"
        | "allRoundMetrics"
        | "roundsWon"
        | "totalDamageDealt"
      >,
      withdrawn = false
    ) => {
      const {
        topic,
        characterId,
        messages,
        allRoundMetrics,
        roundsWon,
        totalDamageDealt,
      } = snapshot;

      const avgLogic =
        allRoundMetrics.length > 0
          ? allRoundMetrics.reduce((s, m) => s + m.logicScore, 0) /
            allRoundMetrics.length
          : 0;
      const avgEvidence =
        allRoundMetrics.length > 0
          ? allRoundMetrics.reduce((s, m) => s + m.evidenceScore, 0) /
            allRoundMetrics.length
          : 0;
      const avgClarity =
        allRoundMetrics.length > 0
          ? allRoundMetrics.reduce((s, m) => s + m.clarityScore, 0) /
            allRoundMetrics.length
          : 0;

      const fullConversation = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }] as [{ text: string }],
      }));

      const won = withdrawn
        ? false
        : finalPlayerHP > finalAiHP || finalAiHP <= 0;

      const saveSession = () =>
        fetch("/api/save-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            characterId,
            playerFinalHP: finalPlayerHP,
            aiFinalHP: finalAiHP,
            avgLogic,
            avgEvidence,
            avgClarity,
            won,
            roundsWon,
            totalDamageDealt,
          }),
        }).catch(() => {});

      try {
        const response = await fetch("/api/verdict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            characterId,
            topic,
            fullConversation,
            finalMetrics: {
              avgLogic,
              avgEvidence,
              avgClarity,
              playerFinalHP: finalPlayerHP,
              aiFinalHP: finalAiHP,
              roundsWon,
            },
          }),
        });

        const data = await response.json();
        const critiqueText =
          response.ok && data.critiqueText
            ? data.critiqueText
            : "STRENGTH: You entered the arena.\n\nWEAKNESS: The verdict systems failed to render a full critique.\n\nVERDICT: Return when combat systems are online.";

        setState((prev) => ({
          ...prev,
          playerHP: finalPlayerHP,
          aiHP: finalAiHP,
          critiqueText,
          phase: "analysis",
          isGameOver: true,
          isLoading: false,
          withdrawn,
        }));

        await saveSession();
      } catch {
        setState((prev) => ({
          ...prev,
          playerHP: finalPlayerHP,
          aiHP: finalAiHP,
          critiqueText:
            "STRENGTH: You fought to the end.\n\nWEAKNESS: Verdict transmission failed.\n\nVERDICT: Rematch when systems recover.",
          phase: "analysis",
          isGameOver: true,
          isLoading: false,
          withdrawn,
        }));

        await saveSession();
      }
    },
    []
  );

  const withdrawFromMatch = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "arena" || !prev.characterId) return prev;

      void triggerEndGame(
        prev.playerHP,
        prev.aiHP,
        {
          topic: prev.topic,
          characterId: prev.characterId,
          messages: prev.messages,
          allRoundMetrics: prev.allRoundMetrics,
          roundsWon: prev.roundsWon,
          totalDamageDealt: prev.totalDamageDealt,
        },
        true
      );

      return { ...prev, isLoading: true, withdrawn: true };
    });
  }, [triggerEndGame]);

  const submitArgument = useCallback(
    async (playerText: string) => {
      const trimmed = playerText.trim();
      if (!trimmed) return;

      setState((prev) => {
        if (
          prev.isLoading ||
          prev.phase !== "arena" ||
          !prev.characterId ||
          !prev.topic
        ) {
          return prev;
        }

        const userMessage: Message = { role: "user", content: trimmed };
        const nextMessages = [...prev.messages, userMessage];
        const conversationHistory = prev.messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

        void (async () => {
          try {
            const response = await fetch("/api/debate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                characterId: prev.characterId,
                topic: prev.topic,
                conversationHistory,
                playerArgument: trimmed,
                round: prev.round,
              }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
              throw new Error(data.error ?? "Debate request failed");
            }

            const metrics: Metrics = {
              logicScore: data.metrics.logicScore,
              evidenceScore: data.metrics.evidenceScore,
              clarityScore: data.metrics.clarityScore,
            };

            const newPlayerHP = Math.max(
              0,
              prev.playerHP - data.playerHPDamage
            );
            const newAiHP = Math.max(0, prev.aiHP - data.aiHPDamage);
            const roundWon = data.aiHPDamage > data.playerHPDamage;
            const nextRound = prev.round + 1;

            const nextMessagesWithAi: Message[] = [
              ...nextMessages,
              {
                role: "model",
                content: data.aiResponseText,
                reactionTag: data.reactionTag,
                refereeSummaryLine: data.refereeSummaryLine,
              },
            ];

            const lastRoundDamage: LastRoundDamage = {
              playerDamageDealt: data.aiHPDamage,
              playerDamageTaken: data.playerHPDamage,
            };

            const matchOver =
              newPlayerHP <= 0 ||
              newAiHP <= 0 ||
              nextRound > prev.maxRounds;

            if (matchOver) {
              setState((s) => ({
                ...s,
                messages: nextMessagesWithAi,
                playerHP: newPlayerHP,
                aiHP: newAiHP,
                roundsWon: roundWon ? prev.roundsWon + 1 : prev.roundsWon,
                totalDamageDealt: prev.totalDamageDealt + data.aiHPDamage,
                allRoundMetrics: [...prev.allRoundMetrics, metrics],
                lastMetrics: metrics,
                round: nextRound,
                refereeSummaryLine: data.refereeSummaryLine ?? "",
                lastRoundDamage,
                isLoading: true,
              }));

              await triggerEndGame(newPlayerHP, newAiHP, {
                topic: prev.topic,
                characterId: prev.characterId,
                messages: nextMessagesWithAi,
                allRoundMetrics: [...prev.allRoundMetrics, metrics],
                roundsWon: roundWon ? prev.roundsWon + 1 : prev.roundsWon,
                totalDamageDealt: prev.totalDamageDealt + data.aiHPDamage,
              });
            } else {
              setState({
                ...prev,
                messages: nextMessagesWithAi,
                playerHP: newPlayerHP,
                aiHP: newAiHP,
                roundsWon: roundWon ? prev.roundsWon + 1 : prev.roundsWon,
                totalDamageDealt: prev.totalDamageDealt + data.aiHPDamage,
                allRoundMetrics: [...prev.allRoundMetrics, metrics],
                lastMetrics: metrics,
                round: nextRound,
                refereeSummaryLine: data.refereeSummaryLine ?? "",
                lastRoundDamage,
                isLoading: false,
              });
            }
          } catch {
            setState((s) => ({
              ...s,
              isLoading: false,
              messages: [
                ...nextMessages,
                {
                  role: "model",
                  content:
                    "Combat systems offline. The arena rejects your transmission — try again.",
                  reactionTag: "LOGICAL ATTACK",
                },
              ],
            }));
          }
        })();

        return {
          ...prev,
          isLoading: true,
          messages: nextMessages,
        };
      });
    },
    [triggerEndGame]
  );

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const rematch = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      topic: prev.topic,
      difficulty: prev.difficulty,
      maxRounds: prev.maxRounds,
      characterId: prev.characterId,
      phase: "arena",
    }));
  }, []);

  return {
    ...state,
    configureMatch,
    acceptTopicReveal,
    selectCharacter,
    submitArgument,
    resetGame,
    rematch,
    goToCharacterSelect,
    withdrawFromMatch,
    clearRoundReaction,
  };
}
