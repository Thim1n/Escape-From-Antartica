// Importation du module express
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// Création d'une instance d'Express
const app = express();

// Middleware pour gérer les requêtes en JSON
app.use(express.json());
app.use(cors());

// Connexion à la base de données
const sequelize = new Sequelize("gamedatabase", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// Vérifier la connexion
sequelize
  .authenticate()
  .then(() => console.log("Connexion à la base de données réussie"))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données:", err)
  );

// Définition des modèles User et Game
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Nom de la table liée
        key: "id", // Clé primaire dans la table User
      },
    },
    time: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { tableName: "game", timestamps: false }
);

// Définir l'association entre User et Game
User.hasMany(Game, { foreignKey: "userId" }); // Un utilisateur peut avoir plusieurs jeux
Game.belongsTo(User, { foreignKey: "userId" }); // Chaque jeu appartient à un utilisateur

// Synchroniser les modèles avec la base de données et créer les tables si elles n'existent pas
sequelize
  .sync()
  .then(() => console.log("Base de données et tables synchronisées"))
  .catch((err) => console.error("Erreur de synchronisation:", err));

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'api d'Escape from Antartica" });
});

// Route de débug et test
app.get("/users", async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.findAll();

    // Vérifier si des utilisateurs existent
    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    }

    // Retourner la liste des utilisateurs
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

app.get("/games", async (req, res) => {
  try {
    const games = await Game.findAll({ raw: true }); // Récupère les données brutes
    console.log("Jeux récupérés :", games);

    if (!games || games.length === 0) {
      return res.status(404).json({ message: "Aucune partie trouvée" });
    }

    res.json(games);
  } catch (error) {
    console.error("Erreur lors de la récupération des parties :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des parties" });
  }
});
app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Game.findAll({
      raw: true, // Retourne des objets JavaScript purs
      limit: 10, // Limite le nombre de résultats
      
    });
    res.json(leaderboard);
  } catch (error) {
    console.error("Erreur lors de la récupération du classement :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//Route pour ajouter un utilisateur
app.post("/adduser", async (req, res) => {
  const { name } = req.body; // On récupère le nom de l'utilisateur depuis la requête

  // Vérifier si le nom a été fourni
  if (!name) {
    return res
      .status(400)
      .json({ error: "Le nom de l'utilisateur est requis" });
  }

  try {
    // Créer un nouvel utilisateur
    const newUser = await User.create({ name });

    // Retourner l'utilisateur créé
    res.status(201).json({
      message: "Utilisateur ajouté avec succès",
      user: newUser,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
  }
});

// Route pour ajouter un jeu
app.post("/addgame", async (req, res) => {
  console.log("Nouvelle partie reçue");

  // Récupérer les données envoyées dans le corps de la requête
  const { score, userId, time } = req.body;

  // Vérifier si les données nécessaires sont présentes
  if (!score || !userId || !time) {
    return res
      .status(400)
      .json({ error: "Données manquantes (score, userId, time)" });
  }

  try {
    // Créer un nouveau jeu avec les données envoyées
    const newGame = await Game.create({
      score,
      userId,
      time,
    });

    // Retourner la réponse avec les données du jeu créé
    res.status(201).json({
      message: "Partie ajoutée avec succès",
    });
    console.log("Partie ajoutée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'ajout du jeu", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du jeu" });
  }
});

app.get("/getplayerid", async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ id: user.id });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID de l'utilisateur",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération de l'ID de l'utilisateur",
    });
  }
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
