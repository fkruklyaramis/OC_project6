# JustStreamIt - Plateforme de Streaming de Films

Une application web permettant de visualiser en temps réel les films les mieux notés dans différentes catégories.

## Prérequis

- Python 3.7 ou supérieur
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)

## Installation et lancement

### 1. Lancer l'API locale

1. Ouvrez un terminal et accédez au dossier API :
```bash
cd API
```

2. Suivez les instructions du fichier `API/readme.md` pour :
   - Installer l'environnement virtuel
   - Installer les dépendances
   - Lancer le serveur API

L'API devrait être accessible à l'adresse : http://localhost:8000

### 2. Lancer l'application web

1. Une fois l'API en cours d'exécution, ouvrez simplement le fichier `index.html` dans votre navigateur.

2. L'application web devrait maintenant afficher :
   - Le meilleur film
   - Les films les mieux notés
   - Les comédies
   - Les biographies
   - Deux sections personnalisables par catégorie

## Fonctionnalités

- Visualisation du film le mieux noté
- Films par catégorie (Comédie, Biographie)
- Sections personnalisables par catégorie
- Modal détaillée pour chaque film
- Design responsive (Desktop, Tablet, Mobile)

## Technologies utilisées

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3
- Font Oswald (Google Fonts)

## Structure du projet

```
JustStreamIt/
│
├── API/                # Dossier contenant l'API
├── css/               # Styles CSS
│   └── style.css
├── js/                # Scripts JavaScript
│   ├── dataManager.js # Gestion des appels API
│   └── main.js        # Logique principale
├── img/               # Images et favicon
└── index.html         # Page principale
```