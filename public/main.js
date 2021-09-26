function subset(arra, arra_size)
 {
    var result_set = [], result;
    
    for(var x = 0; x < Math.pow(2, arra.length); x++)
    {
        result = [];
        i = arra.length - 1; 
        do
        {
            if((x & (1 << i)) !== 0)
            {
                result.push(arra[i]);
            }
        }  while(i--);

        if( result.length == arra_size)
        {
            result_set.push(result);
        }
    }

        return result_set; 
}

function isArrayInArray(source, search) {
    var searchLen = search.length;
    for (var i = 0, len = source.length; i < len; i++) {
        // skip not same length
        if (source[i].length != searchLen) continue;
        // compare each element
        for (var j = 0; j < searchLen; j++) {
            // if a pair doesn't match skip forwards
            if (source[i][j] !== search[j]) {
                break;
            }
            return true;
        }
    }
    return false;
}

function findComplementTeam(group, firstTeam) {
    var complement = []
    // console.log(firstTeam);
    group.forEach(function(player) {

        if (!isArrayInArray(firstTeam, player)) {
            complement.push(player);
        }
    });

    return complement;
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {

        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function matchmakingBalanced() {
    var players = document.getElementById("players").value.split("\n");
    var ratings = document.getElementById("ratings").value.split("\n");
    var teamSize = parseInt(document.getElementById("teamSize").value);

    playerRating = [];

    for (var i = 0; i < players.length; i++) {
        playerRating.push([players[i], ratings[i]]);
    }

    var group = getRandom(playerRating, teamSize * 2);

    var possibleFirstTeams = subset(group, teamSize);

    var possibleMatchups = []
    
    possibleFirstTeams.forEach(function(team) {
        possibleMatchups.push([team, findComplementTeam(group, team)]);
    });

    possibleMatchups.forEach(function(matchup) {
        var team1sum = 0;
        matchup[0].forEach(function(player) {
            team1sum += parseInt(player[1]);
        });
        matchup[0].push(team1sum);

        var team2sum = 0;
        matchup[1].forEach(function(player) {
            team2sum += parseInt(player[1]);
        });
        matchup[1].push(team2sum);

        matchup.push(Math.abs(team1sum - team2sum));
    });

    possibleMatchups.sort(function(a, b) {
        return a[2] - b[2];
    });

    var match = possibleMatchups[0];

    document.getElementById("team1").innerHTML = "";
    document.getElementById("team2").innerHTML = "";
    match[0].slice(0, teamSize).forEach(function(player) {
        document.getElementById("team1").innerHTML += player[0] + " - " + player[1] + "<br>";
    });

    document.getElementById("team1").innerHTML += "Total team MMR: " + match[0].at(-1);

    match[1].slice(0, teamSize).forEach(function(player) {
        document.getElementById("team2").innerHTML += player[0] + " - " + player[1] + "<br>";
    });
    document.getElementById("team2").innerHTML += "Total team MMR: " + match[1].at(-1);
    return match[0] + "," + match[1];
}

function matchmaking(occur) {
    occur = occur || null;
    // console.log("HEY IM BEING CALLED");
    var players = document.getElementById("players").value.split("\n");
    var ratings = document.getElementById("ratings").value.split("\n");
    // console.log(players);
    // console.log(ratings);

    playerRating = [];

    for (var i = 0; i < players.length; i++) {
        playerRating.push([players[i], ratings[i]]);
    }
    var possibleTeams = subset(playerRating, 3);
    var teams = [];
    for (var i = 0; i < possibleTeams.length; i++) {
        if (possibleTeams[i].length == 3) {
            teams.push(possibleTeams[i]);
        }
    }

    for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        var totalMMR = 0;
        team.forEach(function(player) {
            totalMMR += parseInt(player[1]);
        });
        team.push(totalMMR);
    }
    teams.sort(function(a, b) {
        return a[3] - b[3];
    });

    var firstTeam = teams[Math.floor(Math.random()*teams.length)];
    var possibleSecondTeams = [];
    var firstTeamMembers = firstTeam.slice(0, 3);
    for (var i = 0; i < teams.length; i++) {
        members = teams[i].slice(0, 3);
        var contains = members.some(r=> firstTeam.includes(r));
        if (!contains) {
            possibleSecondTeams.push(teams[i]);
        }
    }

    if (occur == null) {
        possibleSecondTeams.sort(function(a, b) {
            return (a[3] - firstTeam[3]);
        });
    } else {
        possibleSecondTeams.sort(function(a, b) {
            return adjustScore(b, firstTeam, occur) - adjustScore(a, firstTeam, occur);
        });
        // console.log(possibleSecondTeams);
    }
    

    // console.log(firstTeam);
    // console.log(possibleSecondTeams);
    document.getElementById("team1").innerHTML = "";
    document.getElementById("team2").innerHTML = "";
    firstTeam.slice(0, 3).forEach(function(player) {
        document.getElementById("team1").innerHTML += player[0] + " - " + player[1] + "<br>";
    });

    document.getElementById("team1").innerHTML += "Total team MMR: " + firstTeam[3];

    possibleSecondTeams[0].slice(0, 3).forEach(function(player) {
        document.getElementById("team2").innerHTML += player[0] + " - " + player[1] + "<br>";
    });
    document.getElementById("team2").innerHTML += "Total team MMR: " + possibleSecondTeams[0][3];
    return firstTeam + "," + possibleSecondTeams[0];
}

var isAlpha = function(ch){
    return typeof ch === "string" && /[A-Za-z]/.test(ch);
}

function matchmakingTest() {
    var total = [];
    for (var i = 0; i < 1000; i++) {
        total.push(matchmakingBalanced());
    }
    var playersList = [];
    for (var i = 0; i < total.length; i++) {
        var list = total[i].split(",");
        list.forEach(function(item) {
            if (isAlpha(item)) {
                playersList.push(item);
            }
        });
    }
    var occur = playersList.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    // console.log(occur);
    return occur;
}

function adjustScore(team, firstTeam, occur) {
    var newScore = 0;
    team.slice(0, 3).forEach(function(player) {
        newScore += (1000 - occur[player[0]]) / 10;
    });
    newScore -= (Math.abs(team[3] - firstTeam[3]));
    return newScore;
}