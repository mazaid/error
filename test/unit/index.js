var error = require(__dirname + '/../../index');
var create = require(__dirname + '/../../create');
var parse = require(__dirname + '/../../parse');

var assert = require('chai').assert;

describe('error base methods', function () {

    it('set message', function () {
        var e = error('test msg');
        assert.equal(e.message, 'test msg');
    });

    it('set code', function () {
        var e = error('test msg', 'code');
        assert.equal(e.message, 'test msg');
        assert.equal(e.code, 'code');
    });

    it('set code via chain method', function () {
        var e = error('test msg').setCode('code');
        assert.equal(e.message, 'test msg');
        assert.equal(e.code, 'code');
    });

    it('set entity', function () {
        var e = error('test msg', 'code', 'task');
        assert.equal(e.message, 'test msg');
        assert.equal(e.code, 'code');
        assert.equal(e.entity, 'task');
    });

    it('set entity via chain method', function () {
        var e = error('test msg', 'code').setEntity('task');
        assert.equal(e.message, 'test msg');
        assert.equal(e.code, 'code');
        assert.equal(e.entity, 'task');
    });

    it('set list', function () {
        var e = error('test msg', 'code')
            .setEntity('task')
            .setList([1,2,3]);

        assert.equal(e.message, 'test msg');
        assert.equal(e.code, 'code');
        assert.equal(e.entity, 'task');
        assert.deepEqual(e.list, [1, 2, 3]);
    });

    it('should be checkable', function () {
        var e = error('test');
        assert.equal(e.checkable, true);
    });


});

describe('create', function () {
    it('should pass ErrorCodes to Error object without entity', function () {

        var ErrorCodes = {TEST_CODE: 'testCode'};

        var error1 = create(ErrorCodes);

        var e = error1('msg', ErrorCodes.TEST_CODE);

        assert.deepEqual(e.ErrorCodes, ErrorCodes);
        assert.equal(e.code, ErrorCodes.TEST_CODE);
    });

    it('should pass ErrorCodes to Error object with entity', function () {

        var ErrorCodes = {TEST_CODE: 'testCode'};

        var error1 = create(ErrorCodes);

        var e = error1('msg', ErrorCodes.TEST_CODE, 'myEntity');

        assert.deepEqual(e.ErrorCodes, ErrorCodes);
        assert.equal(e.code, ErrorCodes.TEST_CODE);
        assert.equal(e.entity, 'myEntity');
    });
});

describe('#parse', function () {

    it('should parse simple error response success', function (done) {
        var data = {message: 'test', entity: 'test', code: 'test', list: [1,2,3]};

        var e = parse(data);

        e.checkChain((e) => {throw new Error('not here');})
            .ifEntity('test')
            .ifCode('test', (e) => {
                assert.equal(e.message, 'test');
                assert.equal(e.code, 'test');
                assert.equal(e.entity, 'test');
                assert.deepEqual(e.list, [1,2,3]);
                done();
            })
            .end()
            .check();

    });

    it('should parse simple error response success without entity', function (done) {
        var data = {message: 'test', code: 'test', list: [1,2,3]};

        var e = parse(data);

        e.checkChain((e) => {throw new Error('not here');})
            .ifCode('test', (e) => {
                assert.equal(e.message, 'test');
                assert.equal(e.code, 'test');
                assert.deepEqual(e.list, [1,2,3]);
                done();
            })
            .check();

    });

    it('should parse simple error response success without list', function (done) {
        var data = {message: 'test', entity: 'test', code: 'test'};

        var e = parse(data);

        e.checkChain((e) => {throw new Error('not here');})
            .ifEntity('test')
            .ifCode('test', (e) => {
                assert.equal(e.message, 'test');
                assert.equal(e.code, 'test');
                assert.equal(e.entity, 'test');
                done();
            })
            .end()
            .check();

    });

    it('should parse error response success with path', function (done) {
        var response = {
            body: {
                error: {message: 'test123', entity: 'test123', code: 'test123', list: [3,2,1]}
            }
        };

        var e = parse(response, 'body.error');

        e.checkChain((e) => {throw new Error('not here');})
            .ifEntity('test123')
            .ifCode('test123', (e) => {
                assert.equal(e.message, 'test123');
                assert.equal(e.code, 'test123');
                assert.equal(e.entity, 'test123');
                assert.deepEqual(e.list, [3,2,1]);
                done();
            })
            .end()
            .check();

    });

    it('should return false if no error.message prop', function (done) {
        var error = {};

        var e = parse(error);

        assert.isNotOk(e);
        done();

    });

    it('should return false if undefined path', function (done) {
        var response = {
            body: {
                somebody: {
                    one: 1
                }
            }
        };

        var e = parse(response, 'body.error');

        assert.isNotOk(e);

        done();

    });

});

describe('checkChain', function () {

    describe('#creation', function () {
        it('should use default callback', function (done) {

            var e = error('msg', 'code');

            e.checkChain(function (error) {
                done();
            })
            .check();

        });

        it('should throw error if no default callback', function (done) {
            var e = error('msg', 'code');

            try {
                e.checkChain().check();
            } catch (e)  {
                assert.equal(e.message, 'MazaiErrorCheckChain: no default callback function');
                done();
            }
        });
    });

    describe('#ifCode', function () {

        it('should use callback', function (done) {
            var e = error('msg', 'code');

            e.checkChain(function (error) {done(new Error('not here'));})
            .ifCode('notNowCode', function (error) {
                done(new Error('not here'));
            })
            .ifCode('code', function (error) {
                assert.equal(error.code, 'code');
                done();
            })
            .check();
        });

        it('should throw error if no args', function (done) {
            var e = error('msg', 'code');

            try {
                e.checkChain(function (error) {done(new Error('not here'));})
                .ifCode()
                .check();
            } catch (e) {
                assert.equal(e.message, 'MazaiErrorCheckChain: fn argument must be a function');
                done();
            }

        });

        it('should throw error if no callback arg', function (done) {
            var e = error('msg', 'code');

            try {
                e.checkChain(function (error) {done(new Error('not here'));})
                .ifCode('test')
                .check();
            } catch (e) {
                assert.equal(e.message, 'MazaiErrorCheckChain: fn argument must be a function');
                done();
            }

        });

        it('should throw error if callback no a function', function (done) {
            var e = error('msg', 'code');

            try {
                e.checkChain(function (error) {done(new Error('not here'));})
                .ifCode('test', '123')
                .check();
            } catch (e) {
                assert.equal(e.message, 'MazaiErrorCheckChain: fn argument must be a function');
                done();
            }

        });

    });

    describe('#ifEntity', function () {

        it('should success check entity', function (done) {
            var e = error('msg', 'code').setEntity('entity');

            e.checkChain(function (error) {done(new Error('not here'));})
            .ifEntity('entity')
            .ifCode('code', function (error) {
                assert.equal(error.code, 'code');
                assert.equal(error.entity, 'entity');
                done();
            })
            .check();
        });

        it('should error if entity not string', function (done) {
            var e = error('msg', 'code').setEntity('entity');

            try {
                e.checkChain(function (error) {done(new Error('not here'));})
                .ifEntity(123)
                .check();
            } catch (e) {
                assert.equal(e.message, 'MazaiErrorCheckChain: entity argument must be a string');
                done();
            }

        });
    });

});
