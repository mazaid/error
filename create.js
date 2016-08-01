var Error = require('./src/Error');

module.exports = function (ErrorCodes) {

    return function (message, code, entity) {
        var e = new Error(message, code);

        e.ErrorCodes = ErrorCodes;

        if (entity) {
            e.setEntity(entity);
        }

        return e;
    };

};
