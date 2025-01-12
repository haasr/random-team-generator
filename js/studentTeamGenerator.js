let players = [];
playerIDCounter = -2147483648;

const onStart = () => {
  hidepList(players);
  displayList(players, "playerList");
};

// Add new Player to the array.
const addPlayer = () => {
  // Check if playername is empty.
  if (document.getElementById("player").value === "") {
    // Set focus on textfield.
    document.getElementById("player").focus();
    return false;
  } else {
    const newPlayer = {
      playerID: "player-" + String(playerIDCounter++),
      name: document.getElementById("player").value.trim(),
      skill: Number(document.getElementById("skill").value),
    };

    players.push(newPlayer);
    document.getElementById("player").value = "";
    document.getElementById("skill").value = 1;

    // Hide list if no players are there to display.
    hidepList();

    // Display a list of players.
    displayList(players, "playerList");

    document.getElementById("player").focus();

    // Don't reload the page on submit.
    return false;
  }
};

const addPlayers = () => {
  if (document.getElementById("players-list").value === "") {
    document.getElementById("players-list").focus();
    return false;
  }
  else {
    let playersString = document.getElementById("players-list").value;
    let playersList;

    if (playersString.includes("\r\n")) {
      playersList = playersString.split("\r\n");
    }
    else if (playersString.includes("\n")) {
      playersList = playersString.split("\n");
    }
    else if (playersString.includes(";")) {
      playersList = playersString.split(";");
    }
    else if (playersString.includes(",")) {
      playersList = playersString.split(",");
    }
    else {
      document.getElementById("players-list").focus();
      return false;
    }

    playersList.forEach(player => {
      const newPlayer = {
        playerID: "player-" + String(playerIDCounter++),
        name: player.trim(),
        skill: 1
      };
      players.push(newPlayer);
    });

    // Hide list if no players are there to display.
    hidepList();

    // Display a list of players.
    displayList(players, "playerList");

    document.getElementById("player").focus();

    // Don't reload the page on submit.
    return false;
  }
}

// Allow enter key to submit a new player everywhere on the page.
document.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

// Add one to the number of teams.
const addNumberOfTeams = () => {
  let currentNumberOfTeams = Number(
    document.getElementById("numberOfTeams").value
  );
  if (currentNumberOfTeams !== 10) {
    currentNumberOfTeams += 1;
    document.getElementById("numberOfTeams").value = currentNumberOfTeams;
  }
  return false;
};

// Subtract one from the number of teams.
const subNumberOfTeams = () => {
  let currentNumberOfTeams = Number(
    document.getElementById("numberOfTeams").value
  );
  if (currentNumberOfTeams !== 1) {
    currentNumberOfTeams -= 1;
    document.getElementById("numberOfTeams").value = currentNumberOfTeams;
  }
  return false;
};

// Shuffle the player array.
const shuffle = () => {
  let currentIndex = players.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // and swap it with the current element.
    temporaryValue = players[currentIndex];
    players[currentIndex] = players[randomIndex];
    players[randomIndex] = temporaryValue;
  }

  // Return the shuffled player array.
  return players;
};

// Create balanced teams based on the skilllevel.
const balancedTeams = () => {
  let teams = [];

  // Sort the player array from strong to weak based of skill.
  const toShuffle = shuffle(players).sort(
    (a, b) => parseFloat(b.skill) - parseFloat(a.skill)
  );

  // Get the number of teams.
  let numberOfTeams = document.getElementById("numberOfTeams").value;
  let lastTeam = numberOfTeams - 1;

  // Create two arrays based of the number of teams.
  const firstEntry = toShuffle.slice(0, numberOfTeams);
  const fillup = toShuffle.slice(numberOfTeams, toShuffle.length);

  // Add the stronges players as entries to the teams and add an element to store the Teamskill.
  for (let i = 0; i < firstEntry.length; i++) {
    const element = firstEntry[i];
    const teamSkill = firstEntry[i].skill;
    const team = [];
    team.push({ teamSkill }, element);
    teams.push(team);
  }

  // push the player from the fillup array to the team, add his skill to the Teamskill and sort the array.
  for (let i = 0; i < fillup.length; i++) {
    const element = fillup[i];
    let playerSkill = element.skill;
    teams[lastTeam].push(element);
    teams[lastTeam][0].teamSkill += playerSkill;
    teams.sort(
      (a, b) => parseFloat(b[0].teamSkill) - parseFloat(a[0].teamSkill)
    );
  }

  // Hide list if no teams are there to display.
  hidetList(teams);

  // Display a list of the teams.
  displayList(teams, "teamList");

  // Reset the teams array.
  teams = [];

  document.getElementById("tList").scrollIntoView({behavior: 'smooth'});
};

// Function to display a list of the players and teams.
const displayList = (arr, list) => {
  let i = 1;
  let x = 0;
  let result = `<div class="row">`;
  if (arr === players) {
    arr.forEach(function (item) {
      if (x%6 == 0) { 
        result += `</div>`;

        result += `<div class="row">`;
        preceded = true;
      }

      result +=
        `<div style="flex: 1 0 0%; padding: 10px;">
            <div style="display: inline-flex;">
            <span class="skill liststyle-left-br">${item.skill}</span>
            <span class="name liststyle-no-br">${item.name}</span>
            <button class="delete liststyle-right-br" id="${item.playerID}" onclick="deletePlayer('${item.playerID}')">
              <i class="fas fa-trash-alt"></i>
            </button>
            </div>
        </div>`;  
      x++;
    });
  } else {
    arr.forEach(function (item) {
      elementS = [];
      elementP = "";
      item.forEach(function (object) {
        if (object.teamSkill) {
          elementS += `<span class="skill green teamskills liststyle ml-3 mr-3"> ${object.teamSkill} </span>`;
          // return false;
        } else {
          elementP += `<span class="name liststyle">${object.name}</span>`;
        }
      });
      result += `<div class="listItem border-brand-blue br-2" style="flex: 1 0 0%; margin: 5px; padding: 5px; box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.2);">
        <div>
          <div class="row">
            <span class="number liststyle ml-3 mr-3 shadow" style="font-size: 1.4rem; font-weight: 600;">Team ${i} </span>
            ${elementS}
          </div>
          <div class="team liststyle"> ${elementP} </div> 
        </div>
      </div>`;
      i++;
    });
  }
  document.getElementById(list).innerHTML = result;
};

// Delete the player from the list and array.
const deletePlayer = (id) => {
  const object = document.querySelector(`#${id}`);
  const index = players
    .map(function (e) {
      return e.playerID;
    })
    .indexOf(id);
  if (index > -1) {
    players.splice(index, 1);
  }

  // Remove object from the list.
  object.parentNode.remove();

  displayList(players, "playerList");
};

// Split shuffled player array into set sized teams.
const randomTeams = () => {
  let teams = [];
  let toShuffle = shuffle(players).slice();

  // Get the number of teams.
  let numberOfTeams = document.getElementById("numberOfTeams").value;

  // Split the players array into set amount of teams.
  while (toShuffle.length) {
    const teamSize = Math.ceil(toShuffle.length / numberOfTeams--);
    const team = toShuffle.slice(0, teamSize);
    teams.push(team);
    toShuffle = toShuffle.slice(teamSize);
  }

  // Hide list if no teams are there to display.
  hidetList(teams);

  // Display a list of the teams.
  displayList(teams, "teamList");

  // Reset the teams array.
  teams = [];

  document.getElementById("tList").scrollIntoView({behavior: 'smooth'});
};

/* Work in progress */
// Check if there are players to display, if not, hide the list element.
const hidepList = (players) => {
  let listBorder = document.getElementById("listBorder");
  let pList = document.getElementById("pList");

  if (players) {
    listBorder.style.display = "none";
    pList.style.display = "none";
  } else {
    listBorder.style.display = "block";
    pList.style.display = "block";
  }
};

// Check if there are teams to display, if not, hide the list element.
const hidetList = (teams) => {
  let listBorder = document.getElementById("listBorder");
  let tList = document.getElementById("tList");

  if (teams !== 0) {
    listBorder.style.display = "block";
    tList.style.display = "block";
  } else if (teams === 0) {
    listBorder.style.display = "block";
    tList.style.display = "none";
  }
};