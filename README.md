# 📞 Application d'appels vidéo augmentés par l'IA

Une application web complète de visioconférence intégrant des agents IA en temps réel, des transcriptions automatiques, des résumés de réunion, et un chat intelligent post-appel. Ce projet met en œuvre des technologies modernes pour simuler une expérience de réunion assistée par l’intelligence artificielle.

## 🚀 Fonctionnalités principales

- 🔴 Appels vidéo en temps réel (Stream Video SDK)
- 🤖 Agents IA personnalisés pendant les appels
- 🧠 Génération de transcriptions et résumés automatiques
- 💬 Chat IA contextuel après l'appel
- 📂 Historique des réunions, statut, recherche dans les transcriptions
- 📺 Lecture vidéo post-appel
- 🔐 Authentification sécurisée
- 💳 Abonnements (Polar)
- 📱 Interface responsive mobile

## 🛠️ Stack technique

- **Frontend :** React 19, Next.js 15, Tailwind CSS v4, Shadcn/UI
- **Backend / Services :** Inngest (jobs d’arrière-plan), Stream Video SDK, Stream Chat SDK
- **Intelligence Artificielle :** Intégration OpenAI
- **DevOps / Outils :** Vercel, GitHub, CodeRabbit (code review AI)

## 📸 Démo

👉 [Lien vers la démo en ligne](https://saas-talkai.vercel.app/)  

## 🧑‍💻 Installation locale

```bash
# 1. Clone le projet
git clone https://github.com/ton-pseudo/ai-video-call-app.git
cd ai-video-call-app

# 2. Installe les dépendances
npm install

# 3. Configure les variables d'environnement
cp .env.example .env.local
# ➤ Remplis les clés API (OpenAI, Stream, etc.)

# 4. Lance le serveur en dev
npm run dev
