document.getElementById("loginForm").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
	event.preventDefault();
	const username = document.getElementById("username").value;
	localStorage.setItem("playerName", username);

	try {
		const res = await fetch("http://localhost:3000/adduser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: username }),
		});

		localStorage.setItem("playMusic", "true");
		window.location.href = "pages/game.html";
	} catch (error) {
		console.error("Error adding user:", error);
		// En cas d'erreur, on redirige quand même vers la page de jeu
		window.location.href = "pages/game.html";
	}
}

function goToLeaderboard() {
	window.location.href = "pages/leaderboard.html";
}

function goToLoserboard() {
	window.location.href = "pages/loserboard.html";
}
