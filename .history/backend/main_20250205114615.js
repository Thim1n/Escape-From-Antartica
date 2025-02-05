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
  



// Définition des modèles et des associations. Les modèles correspondent aux tables dans la base de données
const User = sequelize.define("User", {
    name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  
const Game = sequelize.define("Game", {
id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
score: {
    type: DataTypes.INTEGER,
    allowNull: false
},
userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
    model: 'Users',  // Nom de la table liée
    key: 'id'        // Clé primaire dans la table User
    }
},
time: {
    type: DataTypes.FLOAT,
    allowNull: false
}
});

// Définir l'association entre User et Game
User.hasMany(Game, { foreignKey: 'userId' }); // Un utilisateur peut avoir plusieurs jeux
Game.belongsTo(User, { foreignKey: 'userId' }); // Chaque jeu appartient à un utilisateur

// Synchroniser les modèles avec la base de données
sequelize.sync()
.then(() => console.log('Table User et Game synchronisées avec la base de données'))
.catch((err) => console.error('Erreur de synchronisation:', err));




// Définir une route de base
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'api d'Escape from Antartica" });
});






// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
