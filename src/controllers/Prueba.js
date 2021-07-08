const teams = require('./team.json');
const league = require('./league.json');
const matchs = require('./matchs.json');



const table = [];
// 
addResult = (teamId, result, goalsA, goalsC) => {

    const item = {
        teamId: '',
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        goalsA: 0,
        goalsC: 0,
        pts: 0
    };
    const teamResult = table.findIndex(item => item.teamId == teamId);
    // Si no existe la tabla 
    if (teamResult == -1) {
        console.log('inside')
        item.teamId = teamId;
        if (result == 0) {
            item.pp += 1;
        }
        if (result == 1) {
            item.pe += 1;
        }
        if (result == 3) {
            item.pg += 1;
        }
        item.pts += result;
        item.goalsA += goalsA;
        item.goalsC += goalsC;
        table.push(item)
        // Guarda la tabla
    } else {
        // Actualiza los datos si ya existe
        console.log('other')
        if (result == 0) {
            table[teamResult].pp += 1;
        }
        if (result == 1) {
            table[teamResult].pe += 1;
        }
        if (result == 3) {
            table[teamResult].pg += 1;
        }
        table[teamResult].pts += result;
        table[teamResult].goalsA += goalsA;
        table[teamResult].goalsC += goalsC;
    }
    return table;
};

async function searchResultTeam(teamId) {
    console.log(`equipo buscado: ${teamId}`)
    const result = {
        resultF: undefined,
        goalsA: 0,
        goalsC: 0
    }
    for (let match of matchs) {
        console.log(`team1:${match.team1} - team2: ${match.team2}`)
        if ((match.team1 == teamId && match.goals1 > match.goals2) || (match.team2 == teamId && match.goals2 > match.goals1)) {
            result.resultF = 3;
            result.goalsA = (match.team1 == teamId) ? match.goals1 : match.goals2;
            result.goalsC = (match.team1 == teamId) ? match.goals2 : match.goals1;
        }

        if ((match.team1 == teamId && match.goals1 < match.goals2) || (match.team2 == teamId && match.goals2 < match.goals1)) {
            result.resultF = 0;
            result.goalsA = (match.team1 == teamId) ? match.goals1 : match.goals2;
            result.goalsC = (match.team1 == teamId) ? match.goals2 : match.goals1;
        }

        if (match.goals1 == match.goals2) {
            result.resultF = 1;
            result.goalsA = (match.team1 == teamId) ? match.goals1 : match.goals2;
            result.goalsC = (match.team1 == teamId) ? match.goals2 : match.goals1;
        }

        const { resultF, goalsA, goalsC } = result;
        console.log({ resultF, goalsA, goalsC })
        if (match.team1 == teamId || match.team2 == teamId) {
            await addResult(teamId, resultF, goalsA, goalsC)
        }

    }
    return result;
}

async function run() {
    for (let team of teams) {
        await searchResultTeam(team._id);

    }
    const orderArr = table.sort((a, b) => (a.pts < b.pts) ? 1 : ((b.pts < a.pts) ? -1 : 0))
    console.log(orderArr)
}

run();
