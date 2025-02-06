async function fetchLeaderboardData() {
  try {
    const response = await fetch("body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(200, 220, 255, 0.9)), 
                url('../assets/imgs/login-background.webp');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
}

h1 {
    color: #1b3d6b;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
}

#leaderboard-table {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    width: 80%;
    max-width: 800px;
    overflow: hidden;
}

thead {
    background: rgba(166, 209, 255, 0.3);
}

th {
    padding: 1.2rem;
    color: #1b3d6b;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 2px solid rgba(255, 255, 255, 0.6);
}

td {
    padding: 1rem;
    color: #2c5282;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

tr:hover {
    background: rgba(255, 255, 255, 0.2);
    transition: background 0.3s ease;
}

#back-button {
    margin-top: 2rem;
    padding: 0.8rem 2rem;
    background: rgba(27, 61, 107, 0.8);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: bold;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

#back-button:hover {
    background: rgba(27, 61, 107, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(27, 61, 107, 0.4);
}

tbody tr:nth-child(1) {
    background: rgba(255, 215, 0, 0.1);
}

tbody tr:nth-child(2) {
    background: rgba(192, 192, 192, 0.1);
}

tbody tr:nth-child(3) {
    background: rgba(205, 127, 50, 0.1);
}");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

function renderLeaderboardData(data) {
  const tableBody = document.querySelector("#leaderboard-table tbody");
  tableBody.innerHTML = ""; // Clear existing content
  console.log("Voici les données fetch : ");
  console.log(data);
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
        `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const leaderboardData = await fetchLeaderboardData();
  renderLeaderboardData(leaderboardData);
});
