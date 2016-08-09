var Error = require('./src/Error');

// from http://stackoverflow.com/a/6491621/1715949
var byKey = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};

module.exports = function (error, path) {

    var object;

    if (path) {
        object = byKey(error, path);
    } else {
        object = error;
    }

    if (typeof object === 'undefined' || typeof object.message === 'undefined') {
        return false;
    }

    var e = new Error(object.message, object.code);

    if (typeof object.entity !== 'undefined') {
        e.setEntity(object.entity);
    }

    if (typeof object.list !== 'undefined') {
        e.setList(object.list);
    }

    return e;

};
