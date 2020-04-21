const template = require('../helper/template')
const faceit = require('../libs/faceit')

module.exports = (message) => {
    const content = message.content;
    console.log(content);
    //static shits
    switch(content){
        case "!help": {
            message.reply(template.help);
            return;
        }
    }
    //dynamics
    var splitted_content = content.match("!(.*) (.*)$");
    if (splitted_content != null){
        if (splitted_content[1] == "match"){
            faceit.getMatchInfo(splitted_content[2]).then(result => {
                message.reply(result)
            }).catch(err => {
                message.reply(err)
            })
            return
        } else if (splitted_content[1] == "csgo"){
            faceit.getPlayerInfo(splitted_content[2]).then(result => {
                message.reply(result)
            }).catch(err => {
                message.reply(err)
            })
        }
    }
}