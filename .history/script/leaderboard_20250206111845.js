async function fetchLeaderboardData() {
  try {
    const response = await fetch("http://localhost:3000/leaderboard");
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
  console.log("Voici les données fetch : ")
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
