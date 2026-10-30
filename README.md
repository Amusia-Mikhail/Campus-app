# Campus — Narrative-Driven Mobile & Web RPG for Academic Exam Preparation (TOEFL iBT / IELTS)

> **Note:** This repository is a snapshot of Campus from 8 August 2026 and is out of date. The current version has completed closed beta testing and has been submitted to Google for final review before publication on Google Play. Live web version: https://campus-english.onrender.com

> Campus is a commercial-grade, narrative-driven mobile and web RPG engineered as a core showcase component within an educational ecosystem comprising 4 distinct products. It bridges the gap between engaging AI narrative mechanics and strict TOEFL iBT / IELTS academic test preparation. 

Players navigate their freshman semester at a fictional American university across 50 linear chapters, where story events seamlessly integrate standard exam tasks (Listening lectures, Speaking seminars, Writing essays, and Reading passages).

## 📌 Motivation & Engineering Context
Traditional exam preparation tools are mathematically precise but often dry and repetitive, while narrative AI apps lack academic rigor. I engineered Campus to provide an immersive gamified loop without compromising test authenticity. Built as a zero-budget, production-ready hybrid app (Web, Android AAB, and iOS), it utilizes local client-side evaluation fallback and hybrid server-side Gemini AI models to deliver real-time feedback loops on complex essay writing and speech mechanics.

## 🛠 Tech Stack & Architecture
* **Frontend & Hybrid Runtime:** React, Vite, Tailwind CSS, Ionic Capacitor (`@capacitor/android`, `@capacitor/ios`)
* **Backend Runtime & API Router:** Node.js, Express (`server.cjs`)
* **Database & Cloud State:** Supabase (PostgreSQL with RLS, Auth, session state persistence, snapshot archives)
* **AI Engine & Multi-Key Routing:** Google Gemini API (Flash / Flash-Lite) with dynamic multi-key rotation on 429 rate limits
* **Localization (i18n):** Multi-language UI wrapper supporting 8 global languages (EN, RU, ES, DE, ZH, JA, IT, KO) while maintaining strict English academic content

## ✨ Comprehensive Feature Set & Mechanics

### 🎯 Academic Exam Modules & Diagnostic AI
* **Integrated Exam Tasks:** 50 linear chapters covering Listening (Lectures with note-taking), Speaking (Seminars), Writing (Essays), and Reading (Passages).
* **AI Essay Evaluation (4 Criteria):** Real-time essay scoring evaluated across 4 academic dimensions: Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Accuracy.
* **100-Point Skill Matrix:** Telemetry mapping across all 4 skills (L/S/R/W) on a 100-point scale.
* **Weak Spot Diagnostic Engine:** Analyzes performance data to highlight weak skill areas and suggests targeted chapter reruns.
* **Score Predictor & Transcript Archives:** Estimates TOEFL iBT (±5 pts) / IELTS band scores, stores historical transcript snapshots for comparison over time, and exports official semester report cards via Web Share API.
* **Practice Mode:** Dedicated review module allowing users to re-play and practice previously completed tasks without affecting core story progression.

### 🎮 Gamified Narrative & Social Mechanics
* **Companion Dynamics (Jordan):** Friendship meter tracking relationship points across 8 story milestones (10 to 200 pts), unlocking casual coffee encounters and custom dialogue branches.
* **Mascot Evolution & Pose Album (Biscuit the Cat):** 3-stage visual evolution (Kitten Ch.1–15 → Adolescent Ch.16–33 → Resident Cat Ch.34–50) paired with a locked/blurred photo pose gallery.
* **Dynamic Map & Day Counter:** 10 interactive campus locations featuring dynamic day/night transitions, day-count tracking, and ambient soundscapes.
* **Silhouette Room Customization:** 3 initial dorm archetypes with pixel-calculated CSS positioning (`top`, `left`, `width`, `transform`) for collectible decor.
* **Profile Gamification:** Earnable badges, achievements system, profile decorations, and hidden story easter eggs.

### 💡 Product Utilities & UX Polish
* **In-Context Vocabulary Builder:** In-line word saver during reading/lectures connected to a dedicated flashcard review module.
* **Cross-Task Notes Vault:** Centralized repository for taking, saving, and reviewing personal notes across different lessons.
* **Immersive Audio & Motion:** Smooth UI transition animations and custom ambient sound effects (AudioFX).

### 💳 Monetization Architecture (Campus Plus)
* **Free Tier:** Story chapters, basic client-side evaluation, limited Practice Mode, offline caching.
* **Campus Plus Subscription:** Unlimited real-time Gemini AI essay scoring, cooldown-free Practice Mode, complete Biscuit Pose Gallery access, full transcript snapshot history, and subscriber badges.
* **In-App Purchases:** One-time "Remove Ads Forever" unlock ($3.00).

## 🛡 Cross-Platform & Defensive Mobile Engineering
* **Android Native Pipeline:** Fully compiled, signed Android App Bundle (`app-release.aab`) configured via Android Studio with embedded JDK Java 24 / Gradle synchronization.
* **iOS Safari Optimization:** Forced `font-size: 16px` on input elements to prevent auto-zooming; `AudioContext` instances strictly initialized within direct user-gesture handlers.
* **Service Worker Resilience:** SW caching constrained strictly to `HTTP 200` responses to prevent corrupted offline caching.
* **Database Keepalive Workflows:** GitHub Actions automation (`keepalive.yml`) configured to prevent free-tier database freezing.

## 🚀 Local Development Setup

1. **Clone the repository:**
   git clone https://github.com/Amusia-Mikhail/Campus-app.git

2. **Install dependencies:**
   npm install

3. **Configure Environment Variables in a `.env.local` file:**
   - GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   - VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
   - VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

4. **Launch the web client:**
   npm run dev

5. **Sync Capacitor for mobile builds:**
   - Android: `npx cap sync android` -> `npx cap open android`
   - iOS: `npx cap sync ios` -> `npx cap open ios`
