# Description API

API RESTful en TypeScript permettant la gestion hiérarchique d’objectifs (objectifs, étapes, sous-étapes, tâches).

## Technologies utilisées

* Node.js + Express
* TypeScript
* Drizzle ORM avec PostgreSQL
* Zod pour la validation des données
* JWT pour l’authentification
* Winston pour le logging
* dotenv pour la configuration
* Architecture MVC

## Fonctionnalités principales

* Authentification (inscription, connexion, édition du compte)
* Gestion hiérarchique des objectifs et sous-objectifs
* Statuts : "non commencé", "en cours", "terminé"
* Contraintes sur les dates (respect des dates parents)
* Validation stricte des données
* Traçage des requêtes et erreurs via Winston

## Installation et lancement

1. Installer les dépendances racine :

```bash
pnpm install
```

2. Générer le client Drizzle ORM (si applicable) :

```bash
pnpm generate
```

3. Appliquer les migrations :

```bash
pnpm migrate
```

4. Lancer le serveur en mode développement :

```bash
pnpm run dev:server
```

---
