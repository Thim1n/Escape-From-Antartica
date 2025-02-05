// Importation du module express
const express = require('express');
const { sequelize, DataTypes, Sequelize } = require('sequelize');

// Création d'une instance d'Express
const app = express();

// Middleware pour gérer les requêtes en JSON
app.use(express.json());

// Connexion à la base de données
const sequelize =   new Sequelize('gamedatabase', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Définir une route de base
app.get('/', (req, res) => {
  res.json({ message: "Bienvenu sur l'api d'Escape from Antartica" });
});






// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
