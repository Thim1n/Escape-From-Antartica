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

// Vérifier la connexion
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch((err) => console.error('Erreur de connexion à la base de données:', err));
  
// Définition du modèle user 
const User = sequelize.define("User",{
    name: { 
        type : DataTypes.STRING,
        allowNull : false
     },
     id :{
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
     }
}
);

const Game = sequelize.define("Game",{
    id :{ 
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    score : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    time :{
        type : DataTypes.FLOAT,
        allowNull : false
    }
});

// Définir une route de base
app.get('/', (req, res) => {
  res.json({ message: "Bienvenu sur l'api d'Escape from Antartica" });
});






// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
