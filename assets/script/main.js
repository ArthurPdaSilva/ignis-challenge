const forms = document.getElementById("forms");
forms.addEventListener('submit', generateSoccerMatches);

function generateSoccerMatches(e) {
    e.preventDefault();
    const arrayTeams = getTeamsArray();

    if(validationLengthOfTeams(arrayTeams)) {
        const teamsObject = generateTeamsObject(arrayTeams);
        const middleList = Math.ceil(teamsObject.length / 2);
        const group1 = teamsObject.slice(0, middleList);
        const group2 = teamsObject.slice(middleList);
        generateFirstRound(group1, group2);
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
        teams[i] = { nameTeam: team[0], stateOfTeam: team[1], wins: 0, draws: 0};
    }

    return teams;
}

function generateFirstRound(group1, group2) {
    const matches = [];
    console.log(group1)

    for(let i = 0; group1.length > i; i++) {
        let teamA = group1[i];
        let teamB = group2[i];
        teamA.goals = generateGoals();
        teamB.goals = generateGoals();

        matches[i] = {
            team1: teamA.nameTeam,
            team2: teamB.nameTeam,
            goalsOfTeamA: teamA.goals,
            goalsOfTeamB: teamB.goals,
            state: teamA.stateOfTeam
        }
    }
    console.log(matches);
}

function generateGoals() {
    return Math.round(Math.random() * (10));
}