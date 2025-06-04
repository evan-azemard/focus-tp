# 🎯 Description API

Une API RESTful en TypeScript permettant aux utilisateurs de gérer efficacement leurs objectifs.
Un objectif principal peut être divisé en sous-objectifs appelés étapes. 
Ces étapes peuvent à leur tour être subdivisées en sous-étapes, jusqu’à atteindre le niveau le 
plus bas : la tâche.


## 📦 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **Drizzle ORM** avec **PostgreSQL**
- **Zod** pour la validation
- **JWT** pour l’authentification
- **Winston** pour le logging
- **dotenv** pour la configuration
- Architecture **MVC**

## 📚 Fonctionnalités principales

- Authentification (connexion / inscription / édition compte)
- Gestion hiérarchique des objectifs :
  - Objectifs → Étapes → Sous-étapes → Tâches
- Statuts : "non commencé" | "en cours" | "terminé"
- Contraintes de dates (ne pas dépasser celles du parent ou commencer avant)
- Validation des données avec Zod
- Logger Winston pour tracer les requêtes et erreurs

## 🛠 Installation

```bash
pnpm install
pnpm dev
