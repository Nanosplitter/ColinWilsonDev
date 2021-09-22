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

        if( result.length >= arra_size)
        {
            result_set.push(result);
        }
    }

        return result_set; 
}

function matchmaking() {
    console.log("HEY IM BEING CALLED");
    var players = document.getElementById("players").value.split("\n");
    var ratings = document.getElementById("ratings").value.split("\n");
    console.log(players);
    console.log(ratings);

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

    possibleSecondTeams.sort(function(a, b) {
        return (a[3] - firstTeam[3]);
    });

    console.log(firstTeam);
    console.log(possibleSecondTeams);
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
}