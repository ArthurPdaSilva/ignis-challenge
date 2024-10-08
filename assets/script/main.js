const contentForms = document.getElementById("contentForms");
const contentResults = document.getElementById("contentResults");
const modal = document.getElementById("modal");
const winComponent = document.getElementById("winComponent");

const forms = document.getElementById("forms");
const backButton = document.getElementById("backButton");
const winButton = document.getElementById("winButton");
const closeButton = document.getElementById("close");

forms.addEventListener('submit', startingSoccerMatches);
backButton.addEventListener('click', handleBackToForm);
winButton.addEventListener('click', handleToWinComponent);
closeButton.addEventListener('click', handleCloseModal);

function startingSoccerMatches(e) {
    e.preventDefault();
    const teams = getTeamsArray();

    if(validationLengthOfTeams(teams)) {
        openResults();
        const formattedTeams = formattingTeamList(teams);
        generateRounds(formattedTeams);
    } else {
        alert("O número de times precisa ser par!");
        return;
    }
}

function getTeamsArray() {
    const teamsAdd = document.getElementById("teamsAdd").value;
    return teamsAdd.split('\n');
}

function validationLengthOfTeams(teams) {
    return teams.length % 2 === 0;
}

function openResults() {
    contentResults.style.display = "flex";
    contentForms.style.display = "none";
}

function formattingTeamList(teams) {
    const newTeamsList = [];

    for(let i = 0; teams.length > i; i++) {
        let team = teams[i].split(";");
        newTeamsList[i] = { nameTeam: team[0], stateOfTeam: team[1], goalsMatch: 0, goals: 0, points: 0, wins: 0, draws: 0};
    }

    return newTeamsList;
}

function generateRounds(formattedTeams) {
    const { group1, group2 } = divideTeams(formattedTeams);
    firstTurn(group1, group2);
    secondTurn(group1, group2);
}

function divideTeams(formattedTeams) {
    const middleList = Math.ceil(formattedTeams.length / 2);
    const group1 = formattedTeams.slice(0, middleList);
    const group2 = formattedTeams.slice(middleList);

    return { group1, group2 };
}

function firstTurn(group1, group2) {
    const matcheFirstTurn = document.getElementById("matcheFirstTurn");
    const matcheFirstReturnTurn = document.getElementById("matcheFirstReturnTurn");
    const turn = [];
    const returnMatches = [];
    
    startingMatches(group1, group2, turn, returnMatches);
    
    generateTrs(turn, matcheFirstTurn);
    generateTrs(returnMatches, matcheFirstReturnTurn);
}

function secondTurn(group1, group2) {
    const matcheSecondTurn = document.getElementById("matcheSecondTurn");
    const matcheSecondReturnTurn = document.getElementById("matcheSecondReturnTurn");
    const secondTurn = [];
    const secondReturnMatches = [];
    const { group3, group4 } = changeTeams(group1, group2);
    startingMatches(group3, group4, secondTurn, secondReturnMatches);

    generateTrs(secondTurn, matcheSecondTurn);
    generateTrs(secondReturnMatches, matcheSecondReturnTurn);

    showWinTeam([...group3, ...group4]);
}

function changeTeams(group1, group2) {
    const group3 = [...group1];
    const group4 = [...group2];
    group4.push(group3.pop());
    group3.splice(1, 0, group4.shift()); 
    return { group3, group4 };
}

function startingMatches(groupOne, groupTwo, turn, returnMatches) {
    generateMatches(groupOne, groupTwo, turn);
    generateMatches(groupTwo, groupOne, returnMatches);
    addDoubleRound([...turn, ...returnMatches])
}

function generateMatches(group1, group2, matches) {
    for(let i = 0; group1.length > i; i++) {
        let teamA = group1[i];
        let teamB = group2[i];
        
        generateValuesAndAddGoals(teamA, teamB);

        matches[i] = {
            team1: teamA.nameTeam,
            team2: teamB.nameTeam,
            goalsMatchOfTeamA: teamA.goalsMatch,
            goalsMatchOfTeamB: teamB.goalsMatch,
            state: teamA.stateOfTeam
        }

    }
}

function generateValuesAndAddGoals(teamA, teamB) {
    teamA.goalsMatch = generateRandomGoals();
    teamB.goalsMatch = generateRandomGoals();
    teamA.goals += teamA.goalsMatch;
    teamB.goals += teamB.goalsMatch;
    
    verifyPointsTeam(teamA, teamB);
}

function generateRandomGoals() {
    return Math.round(Math.random() * (10));
}

function verifyPointsTeam(teamA, teamB) {
    if(teamA.goalsMatch > teamB.goalsMatch) {
        teamA.wins += 1;
        teamA.points += 3;
    } else if(teamA.goalsMatch === teamB.goalsMatch) {
        teamA.draws += 1;
        teamB.draws += 1;
        teamA.points += 1;
        teamB.points += 1;
    } else {
        teamB.wins += 1;
        teamB.points += 3;
    }     
}

function addDoubleRound(teams) {
    let c = 1;
    let i = c;
    let index = 0;

    for(let i = 0; i < teams.length; i++) {
        teams[i].double = "";
    }

    while(index < teams.length) {
        while(i < teams.length) {
            checkingDoubleRound(teams[index], teams[i]);
            i++;
        }

        c++;
        i = c;
        index++;
    }
}

function checkingDoubleRound(itemOne, itemTwo) {
    if(itemOne.state === itemTwo.state) {
        itemOne.double = "(Rodada Dupla)";
        itemTwo.double = "(Rodada Dupla)";
    } 
}

function generateTrs(teams, tbody) {
    tbody.innerHTML = "";

    teams.map(item => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.team1}</td>
            <td>${item.team2}</td>
            <td>${item.goalsMatchOfTeamA} x ${item.goalsMatchOfTeamB}</td>
            <td>${item.state}</td>
            <td>${item.double}</td>
        `;

        tbody.appendChild(tr);

    });
}

function showWinTeam(teams) {
    let winTeam = teams[0];
    for(let c = 1; teams.length > c; c++) {
        if(teams[c].points > winTeam.points) {
            winTeam = teams[c];
        }
    }

    generateModalContent(winTeam);
}

function generateModalContent(winTeam) {
    winComponent.innerHTML = "";
    winComponent.appendChild(closeButton);
    addHeaderInModal(winTeam);
    addUlInModal(winTeam);
}

function addHeaderInModal(winTeam) {
    const h1 = document.createElement("h1");
    h1.innerText = `O grande campeão foi o ${winTeam.nameTeam}`;
    winComponent.appendChild(h1);
}

function addUlInModal(winTeam) {
    const ul = document.createElement("ul");
    ul.innerHTML = `
        <li><span>Goals:</span> ${winTeam.goals}</li>
        <li><span>Pontos:</span> ${winTeam.points}</li>
        <li><span>Vitórias:</span> ${winTeam.wins}</li>
        <li><span>Empates:</span> ${winTeam.draws}</li>
        <li><span>Estado:</span> ${winTeam.stateOfTeam}</li>
    `;
    winComponent.appendChild(ul);
}

function handleCloseModal() {
    modal.style.display = "none";
}

function handleToWinComponent() {
    modal.style.display = "block";
}

function handleBackToForm() {
    contentResults.style.display = "none";
    contentForms.style.display = "flex";
}