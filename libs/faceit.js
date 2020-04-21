const axios = require('axios');
const faceitApi = axios.create({
    baseURL: 'https://api.faceit.com',
    timeout: 5000
  });

  async function getMatchInfo(match_id){
    const matchInfo = await (faceitApi.get(`/match/v2/match/${match_id}`));
    const payload = matchInfo.data.payload;
    var gameName = payload.entity.name;
    var gameServer = payload.region;
    var votingEntityType = payload.voting.voted_entity_types[0];
    var voted = payload.voting[votingEntityType].pick
    var voted_str = "";
    voted.forEach(elm => {
        voted_str += elm + " ";
    });
    const teams = payload.teams;
    var roster1 = "";
    var roster2 = "";
    var totalELO1 = 0;
    var totalELO2 = 0;
    const faction1 = teams.faction1.roster;
    const faction1Name = teams.faction1.name;
    faction1.forEach(elm => {
        roster1 += `${elm.nickname} *Level ${elm.gameSkillLevel} - ELO ${elm.elo} (${elm.memberships[0]})*\n`
        totalELO1 += elm.elo
    });
    const faction2 = teams.faction2.roster;  
    const faction2Name = teams.faction2.name;
    faction2.forEach(elm => {
        roster2 += `${elm.nickname} *Level ${elm.gameSkillLevel} - ELO ${elm.elo} (${elm.memberships[0]})*\n`
        totalELO2 += elm.elo
    });
    const diffElo1 = totalELO1 - totalELO2;
    const diffElo2 = totalELO2 - totalELO1;
    const avgElo1 = totalELO1/5;
    const avgElo2 = totalELO2/5;   
    const demo = payload.demoURL;
    return `\n----------------\n${gameName} - ${gameServer}\n**${voted_str}**\n-----------------\n**${faction1Name}**\n*Total ${totalELO1} [${diffElo1}]*\nAvg ${avgElo1}\n\n${roster1}\n**${faction2Name}**\n*Total ${totalELO2} [${diffElo2}]*\nAvg ${avgElo2}\n\n${roster2}\n\nDemo: ${demo}`;
}
module.exports.getMatchInfo = getMatchInfo;



async function getPlayerInfo(nickname){
    const hit = await (faceitApi.get(`/core/v1/nicknames/${nickname}`));
    const playerInfo = hit.data.payload;
    const csgoInfo = playerInfo.games.csgo;
    const csgoId = playerInfo.guid;
    const hit2 = await (faceitApi.get(`/stats/v1/stats/users/${csgoId}/games/csgo`));
    const csgoData = hit2.data.lifetime;
    return `**\n${nickname} a.k.a ${csgoInfo.game_name} (${playerInfo.country.toUpperCase()})
Level ${csgoInfo.skill_level}
ELO: ${csgoInfo.faceit_csgo_elo || csgoInfo.faceit_elo}, Total Matches: ${csgoData.m1}, KD Ratio: ${csgoData.k5}, HeadShot Avg:  ${csgoData.k8}%, Win Rate: ${csgoData.k6}**
https://steamcommunity.com/profiles/${playerInfo.steam_id_64}`;
}
module.exports.getPlayerInfo = getPlayerInfo;
