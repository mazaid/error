'use strict';

var CheckChain = require('./CheckChain');

var regexps = [
    /^\s+at MazaiError/,
    /^\s+at module.exports.*error\/src\/errorFunction\.js/
];

/**
 * @class
 */
class MazaiError extends Error {

    /**
     * @constructor
     * @param  {string} message
     * @param  {string} code
     */
    constructor(message, code) {
        super(message);

        this.code = code;
        this.entity = null;
        this.list = null;

        this.checkable = true;

        this._fixStack();
    }

    /**
     * set error code
     *
     * @param {string} code
     */
    setCode(code) {
        this.code = code;
        return this;
    }

    /**
     * set entity
     *
     * @param {string} entity
     */
    setEntity(entity) {
        this.entity = entity;
        return this;
    }

    /**
     * set error list
     *
     * @param {string} list
     */
    setList(list) {
        this.list = list;
        return this;
    }

    /**
     * get checkChain
     *
     * @param  {function} defaultResponse
     * @param  {Logger} logger
     * @return {CheckChain}
     */
    checkChain(defaultResponse, logger) {
        if (!defaultResponse) {
            throw new Error('MazaiErrorCheckChain: no default callback function');
        }

        var chain = new CheckChain(this, null, logger);

        chain.setDefault(defaultResponse);

        return chain;
    }

    /**
     * remove module error stack line
     *
     * @private
     */
    _fixStack() {
        var lines = this.stack.split('\n');

        var stack = [];

        for (let line of lines) {

            let skip = false;

            for (let regexp of regexps) {

                if (line.match(regexp)) {
                    skip = true;
                    break;
                }
            }

            if (skip) {
                continue;
            }

            stack.push(line);
        }

        this.stack = stack.join('\n');

    }

}

module.exports = MazaiError;
