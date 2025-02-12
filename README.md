Escape From Antarctica
Description

Escape From Antarctica est un jeu de plateforme "die and retry" punitif, rapide et intense. Le but du jeu est de naviguer à travers des obstacles difficiles et de minimiser les morts. Chaque tentative doit être plus rapide et plus habile, avec l’objectif de marquer le meilleur score tout en survivant le plus longtemps possible.
Installation
1. Configurer la base de données

Avant de lancer le jeu, il est nécessaire d'initialiser une base de données MySQL avec deux tables :

    users : Contient les informations des joueurs.
    games : Contient les scores et les statistiques de chaque session de jeu.

Voici la structure des tables à créer :

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score INT,
  time INT,
  userID INT,
  deaths INT,
  FOREIGN KEY (userID) REFERENCES users(id)
);

2. Lancer le serveur backend

Le backend est construit en Node.js. Avant de lancer le jeu dans le navigateur, il est nécessaire de démarrer le serveur Node.js.

    Assurez-vous d'avoir Node.js installé. Si ce n'est pas déjà fait, vous pouvez le télécharger depuis nodejs.org.
    Allez dans le dossier du backend et installez les dépendances :

cd backend
npm install

    Démarrez le serveur Node.js :

npm start

3. Lancer le jeu dans le navigateur

Une fois le serveur Node.js en marche, vous pouvez lancer le jeu dans votre navigateur. Nous recommandons d'utiliser live-server pour faciliter le lancement.

    Installez live-server si ce n'est pas déjà fait :

npm install -g live-server

    Allez dans le dossier principal du projet et lancez le serveur local :

live-server

Le jeu sera accessible dans votre navigateur à l'adresse http://localhost:8080.
Objectif du jeu

Le but est de progresser dans le niveau en évitant les obstacles et en collectant des bonus, tout en minimisant le nombre de morts. Chaque partie est rapide, mais chaque échec vous pousse à améliorer vos compétences pour atteindre un meilleur score. Le score final est basé sur le temps écoulé et le nombre de morts.
