Smart Inventory System:
Serveur HTTP Node.js sans framework pour servir des données statiques d'inventaire (produits et commandes).
Description:
Ce projet implémente un serveur HTTP basique utilisant uniquement les modules natifs de Node.js pour servir des données statiques au format JSON. Il respecte les contraintes suivantes :

Pas de framework HTTP tiers (Express, etc.)
Lecture seule des fichiers JSON
Routage propre avec gestion des erreurs
Logging via EventEmitter
Architecture claire et maintenable
Structure du projet:
smart-inventory-system/
├── src/
│   ├── server/
│   │   └── server.js          # Serveur HTTP principal
│   ├── router/
│   │   └── router.js          # Système de routage
│   ├── controllers/
│   │   ├── productController.js   # Contrôleur des produits
│   │   ├── orderController.js     # Contrôleur des commandes
│   │   └── healthController.js    # Contrôleur de santé
│   ├── services/
│   │   └── dataService.js     # Service de gestion des données
│   └── utils/
│       └── logger.js          # Système de logging
├── data/
│   ├── products.json          # Données des produits
│   └── orders.json            # Données des commandes
├── index.js                   # Point d'entrée
├── package.json               # Configuration npm
├── .env.sample               # Exemple de configuration
└── README.md                 # Documentation

Installation:
1.Cloner le projet
2.Installer les dépendances : npm install
3.Copier le fichier de configuration : cp .env.sample .env
4.Démarrer le serveur : npm run dev
# ou
npm start
Le serveur démarrera sur le port 3000 par défaut (configurable via la variable d'environnement PORT).
API Endpoints
Produits
GET /api/products
Récupérer tous les produits avec filtres optionnels.

Query Parameters :
q : Recherche textuelle (nom, description, SKU)
category : Filtrer par catégorie
minPrice : Prix minimum
maxPrice : Prix maximum
inStock : Filtrer par disponibilité (true/false)
page : Numéro de page (pagination)
limit : Nombre d'éléments par page
Exemples :
curl "http://localhost:3000/api/products?category=tools&minPrice=10&maxPrice=100&page=2&limit=5"
curl "http://localhost:3000/api/products?q=marteau"
curl "http://localhost:3000/api/products?inStock=true"
GET /api/products/:id
Récupérer un produit par son ID.

Exemple : curl "http://localhost:3000/api/products/1"
Commandes
GET /api/orders
Récupérer toutes les commandes avec filtres optionnels.

Query Parameters :
status : Filtrer par statut (pending, paid, shipped, delivered, cancelled)
from : Date de début (format YYYY-MM-DD)
to : Date de fin (format YYYY-MM-DD)
page : Numéro de page (pagination)
limit : Nombre d'éléments par page
Exemples :
curl "http://localhost:3000/api/orders?status=paid&from=2024-01-01&to=2024-12-31&limit=20"
curl "http://localhost:3000/api/orders?status=shipped"
GET /api/orders/:id
Récupérer une commande par son ID.

Exemple : curl "http://localhost:3000/api/orders/1"

GET /api/orders/number/:orderNumber
Récupérer une commande par son numéro.

Exemple : curl "http://localhost:3000/api/orders/number/ORD-2025-0007"
Santé
GET /health
Vérifier l'état du serveur.

Réponse :
{
  "status": "ok",
  "uptime": 3600,
  "timestamp": "2025-01-01T12:00:00.000Z"
}
Exemple : curl "http://localhost:3000/health"
Gestion des erreurs
Le serveur retourne les codes d'erreur HTTP suivants :

200 : Succès
400 : Requête invalide (paramètres incorrects, minPrice > maxPrice, etc.)
404 : Ressource non trouvée
500 : Erreur interne du serveur (lecture/parse JSON échoué)
Pagination
Lors de l'utilisation des paramètres page et limit, la réponse inclut des informations de pagination :
{
  "data": [...],
  "pagination": {
    "total": 12,
    "page": 1,
    "pages": 3,
    "limit": 5
  }
}
Logging
Le système de logging utilise EventEmitter pour tracer les requêtes et réponses :
[2025-01-01T12:00:00.000Z] REQUEST: GET /api/products
[2025-01-01T12:00:00.010Z] RESPONSE: 200 /api/products
Configuration
Variables d'environnement disponibles :

PORT : Port d'écoute du serveur (défaut: 3000)
Scripts npm
npm start : Démarrer le serveur en production
npm run dev : Démarrer le serveur en développement
npm test : Exécuter les tests (non implémenté)
Contraintes techniques
-Serveur HTTP Node.js sans framework
-Endpoints lecture seule sur fichiers JSON
-Routage propre, gestion des erreurs
-Réponses JSON avec Content-Type approprié
-Logging minimal via EventEmitter
-Architecture claire et maintenable
-Pas d'écriture disque (lecture seule)
-Parsing URL avec url.parse()
-Cache mémoire acceptable pour les données
Technologies utilisées
Node.js (modules natifs uniquement)
JavaScript ES6+
JSON pour les données
EventEmitter pour le logging
dotenv pour la configuration