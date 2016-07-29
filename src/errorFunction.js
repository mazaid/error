var Error = require('./Error');

module.exports = function (message, code, entity) {
    var e = new Error(message, code);

    if (entity) {
        e.setEntity(entity);
    }

    return e;
};
