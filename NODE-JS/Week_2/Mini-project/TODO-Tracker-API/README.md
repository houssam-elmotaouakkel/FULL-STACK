# TODO-Tracker-API

API REST minimale pour gérer des tâches (TODOs) — projet d'apprentissage Express.js.

## Description
Service backend CRUD pour des TODOs utilisant un fichier JSON comme stockage (src/data/todos.json). Fournit filtres, pagination, journalisation (morgan) et gestion centralisée des erreurs.

## Fonctionnalités
- Lister les todos avec filtres (status, priority, q) et pagination.
- Récupérer un todo par id.
- Créer, mettre à jour, supprimer un todo.
- Basculer l'état `completed` d'un todo (/api/todos/:id/toggle).
- Logging via morgan et handler d'erreurs centralisé.
- Stockage simple dans `src/data/todos.json`.

## Prérequis
- Node.js 18+ installé
- npm (fourni avec Node)

## Installation
1. Cloner le repo ou copier les fichiers dans un dossier local.
2. Se placer dans le dossier du projet :
   - PowerShell (Windows) :
     cd "c:\Users\HOUSS\Downloads\FULL-STACK\NODE-JS\Week_2\Mini-project\TODO-Tracker-API"
3. Installer les dépendances :
   npm install

## Lancer le serveur
- Démarrer :
  node src/server.js
- Ou ajouter un script dans package.json (optionnel) :
  "start": "node src/server.js"
  puis :
  npm start

Le serveur écoute par défaut sur le port défini dans `.env` (ex: 3000). URL de base : http://localhost:3000/api/todos

## Variables d'environnement
Le projet utilise dotenv. Exemple de `.env` :
```
PORT=3000
PROJECT_NAME=TODO-Tracker-API
VERSION=1.0.0
```
Ne committer jamais le fichier `.env` (il peut contenir des secrets).

## Endpoints principaux

Base : /api/todos

- GET /api/todos
  - Description : liste paginée et filtrable
  - Query params :
    - status=active|completed (filtre par statut)
    - priority=low|medium|high (filtre par priorité)
    - q=terme (recherche dans le titre)
    - page=1 (numéro de page)
    - limit=10 (éléments par page)
  - Exemple :
    curl "http://localhost:3000/api/todos?status=active&priority=high&q=express&page=1&limit=5"

- GET /api/todos/:id
  - Récupère un todo par id
  - Exemple :
    curl "http://localhost:3000/api/todos/1"

- POST /api/todos
  - Créer un todo
  - Body JSON (Content-Type: application/json) :
    {
      "title": "Nouvelle tâche",
      "priority": "medium",
      "dueDate": "2025-11-30"
    }
  - Exemple :
    curl -X POST -H "Content-Type: application/json" -d '{"title":"Test","priority":"low"}' http://localhost:3000/api/todos

- PATCH /api/todos/:id
  - Mettre à jour champs autorisés : title, completed, priority, dueDate
  - Exemple :
    curl -X PATCH -H "Content-Type: application/json" -d '{"title":"Titre modifié"}' http://localhost:3000/api/todos/3

- PATCH /api/todos/:id/toggle
  - Basculer `completed` true/false
  - Exemple :
    curl -X PATCH http://localhost:3000/api/todos/3/toggle

- DELETE /api/todos/:id
  - Supprime un todo
  - Exemple :
    curl -X DELETE http://localhost:3000/api/todos/3

## Format des données
Un todo ressemble à :
{
  "id": 1,
  "title": "Exemple",
  "completed": false,
  "priority": "medium",
  "dueDate": "2025-11-30" | null,
  "createdAt": "2025-10-31T10:00:00.000Z",
  "updatedAt": "2025-11-12T10:22:28.516Z"
}

Les données sont persistées dans `src/data/todos.json`.

## Journalisation & erreurs
- Logging HTTP : middleware `src/middlewares/logger.js` (morgan).
- Gestion des erreurs : `src/middlewares/errorHandler.js` renvoie JSON standardisé.

## Remarques / points connus
- Le projet utilise un fichier JSON pour persistance : pas adapté pour production.
- Vérifier `createTodo` dans le service : `createdAt` doit être `new Date().toISOString()` (appel de fonction) — corriger si nécessaire.
- `.gitignore` contient `node_modules/` et `.env` pour éviter de pousser dépendances et secrets.

## Tests
Aucun test automatisé inclus. Pour tester manuellement, utiliser curl ou Postman sur les endpoints décrits.

## Contribution
- Forker, créer une branche feature, ouvrir une Pull Request.
- Respecter le style et écrire des messages de commit clairs.

## Licence
ISC (voir package.json)
