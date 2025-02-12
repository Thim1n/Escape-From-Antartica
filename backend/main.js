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
const User = sequelize.define(
	"User",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
	},
	{ tableName: "user", timestamps: false, freezeTableName: true }
);

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
				model: "Users",
				key: "id",
			},
		},
		time: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		deaths: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{ tableName: "game", timestamps: false }
);

// Définir l'association entre User et Game
User.hasMany(Game, { foreignKey: "userId" });
Game.belongsTo(User, { foreignKey: "userId" });

// Synchroniser les modèles avec la base de données
sequelize
	.sync()
	.then(() => console.log("Base de données et tables synchronisées"))
	.catch((err) => console.error("Erreur de synchronisation:", err));

// Route de base
app.get("/", (req, res) => {
	res.json({ message: "Bienvenue sur l'api d'Escape from Antartica" });
});

// Route du leaderboard modifiée pour afficher les morts
app.get("/leaderboard", async (req, res) => {
	try {
		const leaderboard = await sequelize.query(
			`WITH RankedGames AS (
        SELECT 
          u.name,
          g.time,
          g.deaths,
          g.score,
          ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY g.deaths ASC, g.time ASC) as rn
        FROM game g
        JOIN user u ON g.userId = u.id
      )
      SELECT 
        name,
        deaths,
        time,
        score
      FROM RankedGames
      WHERE rn = 1
      ORDER BY deaths ASC, time ASC
      LIMIT 15;`,
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		res.json(leaderboard);
	} catch (error) {
		console.error("Erreur lors de la récupération du classement :", error);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

app.get("/loserboard", async (req, res) => {
	try {
		const loserboard = await sequelize.query(
			`WITH RankedGames AS (
    SELECT 
        u.name,
        g.time,
        g.deaths,
        g.score,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY g.deaths DESC, g.time DESC) as rn
    FROM game g
    JOIN user u ON g.userId = u.id
)
SELECT 
    name,
    deaths,
    time,
    score
FROM RankedGames
WHERE rn = 1
ORDER BY deaths DESC, time DESC
LIMIT 15;
`,
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		res.json(loserboard);
	} catch (error) {
		console.error("Erreur lors de la récupération du classement :", error);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// Route pour ajouter un utilisateur
app.post("/adduser", async (req, res) => {
	const { name } = req.body;

	if (!name) {
		return res
			.status(400)
			.json({ error: "Le nom de l'utilisateur est requis" });
	}

	try {
		const existingUser = await User.findOne({ where: { name } });
		if (existingUser) {
			return res
				.status(409)
				.json({ error: "Le nom de l'utilisateur est déjà enregistré" });
		}

		const newUser = await User.create({ name });
		res.status(201).json({
			message: "Utilisateur ajouté avec succès",
			user: newUser,
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'utilisateur", error);
		res.status(500).json({
			error: "Erreur lors de l'ajout de l'utilisateur",
		});
	}
});

// Route pour ajouter un jeu - modifiée pour inclure les morts
app.post("/savegame", async (req, res) => {
	console.log("Nouvelle partie reçue");
	const { name, time, deaths } = req.body;
	console.log("Données de la partie :", req.body);

	if (!name || !time) {
		return res
			.status(400)
			.json({ error: "Données manquantes (name, time)" });
	}

	try {
		let user = await User.findOne({
			where: { name },
		});

		if (!user) {
			user = await User.create({
				name,
			});
			console.log("Nouvel utilisateur créé :", user);
		} else {
			console.log("Utilisateur existant trouvé :", user);
		}

		const timeInSeconds = time / 1000;

		const newGame = await Game.create({
			userId: user.id,
			time: timeInSeconds,
			deaths: deaths || 0, // Si deaths n'est pas fourni, on met 0 par défaut
			score: 0,
		});

		res.status(201).json({
			message: "Partie ajoutée avec succès",
			game: newGame,
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

// Démarrer le serveur
app.listen(3000, () => {
	console.log("Serveur démarré sur http://localhost:3000");
});
