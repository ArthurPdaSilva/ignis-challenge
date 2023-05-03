const forms = document.getElementById("forms");
forms.addEventListener('submit', generateSoccerMatches);

function generateSoccerMatches(e) {
    e.preventDefault();
    const arrayTeams = getTeamsArray();

    if(validationLengthOfTeams(arrayTeams)) {
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
    const matches = [];
    const matches2 = [];
    const middleList = Math.ceil(teamsObject.length / 2);
    const group1 = teamsObject.slice(0, middleList);
    const group2 = teamsObject.slice(middleList);
    generateMatches(group1, group2, matches);
    console.log(matches);
}

function generateMatches(group1, group2, matches, next = 0) {
    for(let i = next; group1.length + next > i; i++) {
        let teamA = group1[i - next];
        let teamB = group2[i - next];

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

function changeTeams() {
    
}