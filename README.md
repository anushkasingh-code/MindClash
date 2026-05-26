# ⚔️ MINDCLASH

### *The AI that refuses to agree with you.*

**MindClash** is a full-stack, gamified adversarial debate arena built to combat **AI sycophancy**—the tendency of commercial LLMs to flatter and validate the user. This platform pairs an aggressive AI opponent with a neutral AI referee to turn logical arguments into literal combat.

[**ENTER THE ARENA (LIVE DEMO) →**](https://mind-clash-livid.vercel.app/)

---

## 🎯 Core Engineering & Philosophy

*   **Anti-Sycophancy Design:** Built to break the chatbot "intellectual mirror." Topics are randomized, feedback is blunt, and scores are mathematically strict.
*   **Dual-Agent Pipeline:** 
    *   **Agent 1 (The Debater):** Uses strict adversarial prompts to aggressively exploit gaps in user logic.
    *   **Agent 2 (The Referee):** A neutral evaluator that grades each turn on *Logic, Evidence,* and *Clarity*, instantly converting the score into UI health bar damage.

[ User Browser ] ───► POST /api/debate ───► [ Serverless Edge Handler ]
│
┌────────────────────────────────────────────┴───────────────────────────────────────────┐
▼                                                                                        ▼
[ Agent 1: The Debater ]                                                             [ Agent 2: The Referee ]
Relentless Counter-Argument                                                          Computes Metrics & HP Damage


---

## 🎭 The Cast & Arena Tiers

### Character Archetypes
*   ⚗️ **The Empiricist (Starter):** Rejects speculation. Demands data boundaries for every claim.
*   🕳️ **The Nihilist (Starter):** Attacks baseline assumptions. Dissolves your premise.
*   📊 **The Hyperrealist (Starter):** Strips narrative down to raw structural and economic incentives.
*   🔄 **The Contrarian (Advanced):** Systematically opposes the majority consensus on principle.
*   🏗️ **The Steelman (Advanced):** Optimizes your argument to its strongest form, then targets that.
*   🎭 **The Sophist (Boss):** Master of rhetoric. Uses elegant fallacies that sound like objective truth.
*   🔱 **The Absolutist (Boss):** Operates on binary truths. Zero room for compromise.

### Match Configurations
*   **NOVICE:** 3 Rounds | Concrete concepts | Adapted opponent aggression
*   **CHALLENGER:** 4 Rounds | Contested socio-political topics | Adaptive argument positioning
*   **BRUTAL:** 5 Rounds | Metaphysical and systemic layers | Maximum intellectual hostility

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 14 (App Router, Serverless Edge Route Handlers)
*   **Language:** TypeScript (Strict type-safe payloads)
*   **AI Engine:** Google Gemini 1.5 Flash (Parallel agent execution)
*   **Database:** Supabase (PostgreSQL for session persistence & global leaderboards)
*   **Deployment:** Vercel Platform

---

## ⚡ Quick Start

```bash
git clone [https://github.com/anushkasingh-code/mindclash.git](https://github.com/anushkasingh-code/mindclash.git)
cd mindclash && npm install
