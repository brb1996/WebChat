const moment = require('moment');

function formatMessage(username, text, gender) {
    return {
        username, 
        text,
        gender,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessage;