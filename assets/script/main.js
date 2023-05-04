const contentForms = document.getElementById("contentForms");
const contentResults = document.getElementById("contentResults");
const forms = document.getElementById("forms");
const backButton = document.getElementById("backButton");

forms.addEventListener('submit', generateSoccerMatches);
backButton.addEventListener('click', handleBackToForm);

function generateSoccerMatches(e) {
    e.preventDefault();
    const arrayTeams = getTeamsArray();

    if(validationLengthOfTeams(arrayTeams)) {
        alert("Gerando resultados...");
        contentResults.style.display = "flex";
        contentForms.style.display = "none";
        const teamsObject = generateTeamsObject(arrayTeams);
        generateRounds(teamsObject);
    } else {
        alert("O número de times precisa ser par!");
        return;
    }
}

function getTeamsArray() {
    const teamsAdd = document.getElementById("teamsAdd").value;
    return teamsAdd.split('\n');
}

function validationLengthOfTeams(arrayTeams) {
    return arrayTeams.length % 2 === 0;
}

function generateTeamsObject(arrayTeams) {
    const teams = [];

    for(let i = 0; arrayTeams.length > i; i++) {
        let team = arrayTeams[i].split(";");
        teams[i] = { nameTeam: team[0], stateOfTeam: team[1], goals: 0, points: 0, wins: 0, draws: 0};
    }
    return teams;
}

function generateRounds(teamsObject) {
    const middleList = Math.ceil(teamsObject.length / 2);
    const group1 = teamsObject.slice(0, middleList);
    const group2 = teamsObject.slice(middleList);
    firstTurn(group1, group2);
}

function firstTurn(group1, group2) {
    const matcheFirstTurn = document.getElementById("matcheFirstTurn");
    const matcheFirstReturnTurn = document.getElementById("matcheFirstReturnTurn");

    const turn = [];
    const returnMatches = [];
    
    generateMatches(group1, group2, turn);
    generateMatches(group2, group1, returnMatches);
    
    addDoubleRound([...turn, ...returnMatches])

    generateTrs(turn, matcheFirstTurn);
    generateTrs(returnMatches, matcheFirstReturnTurn);
    
    secondTurn(group1, group2);
}

function secondTurn(group1, group2) {
    const matcheSecondTurn = document.getElementById("matcheSecondTurn");
    const matcheSecondReturnTurn = document.getElementById("matcheSecondReturnTurn");

    const secondTurn = [];
    const secondReturnMatches = [];
    const { group3, group4 } = changeTeams(group1, group2);

    generateMatches(group3, group4, secondTurn);
    generateMatches(group4, group3, secondReturnMatches);

    addDoubleRound([...secondTurn, ...secondReturnMatches]);

    generateTrs(secondTurn, matcheSecondTurn);
    generateTrs(secondReturnMatches, matcheSecondReturnTurn);
}

function generateTrs(arrayTeams, tbody) {
    tbody.innerHTML = "";

    arrayTeams.map(item => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.team1}</td>
            <td>${item.team2}</td>
            <td>${item.goalsOfTeamA} x ${item.goalsOfTeamB}</td>
            <td>${item.state}</td>
            <td>${item.double}</td>
        `;

        tbody.appendChild(tr);

    });
}

function changeTeams(group1, group2) {
    const group3 = group1;
    const group4 = group2;
    group4.push(group3.pop());
    group3.splice(1, 0, group4.shift()); 
    return { group3, group4 };
}

function generateMatches(group1, group2, matches) {
    for(let i = 0; group1.length > i; i++) {
        let teamA = group1[i];
        let teamB = group2[i];

        teamA.goals = generateGoals();
        teamB.goals = generateGoals();

        if(teamA.goals > teamB.goals) {
            teamA.wins += 1;
            teamA.points += 3;
        } else if(teamA.goals === teamB.goals) {
            teamA.draws += 1;
            teamB.draws += 1;
            teamA.points += 1;
            teamB.points += 1;
        } else {
            teamB.wins += 1;
            teamB.points += 3;
        }

        matches[i] = {
            team1: teamA.nameTeam,
            team2: teamB.nameTeam,
            goalsOfTeamA: teamA.goals,
            goalsOfTeamB: teamB.goals,
            state: teamA.stateOfTeam
        }

    }
}

function generateGoals() {
    return Math.round(Math.random() * (10));
}

function handleBackToForm() {
    contentResults.style.display = "none";
    contentForms.style.display = "flex";
    alert("Voltando...");
}

function addDoubleRound(arrayTeams) {
    let c = 1;
    let i = c;
    let index = 0;

    for(let i = 0; i < arrayTeams.length; i++) {
        arrayTeams[i].double = "";
    }

    while(index < 5) {
        while(i <= 5) {
            checkingDoubleRound(arrayTeams[index], arrayTeams[i]);
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
