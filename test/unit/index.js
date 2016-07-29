var error = require(__dirname + '/../../src/errorFunction');

// try {
//     throw error('test', 'code');
// } catch (e) {
//     console.log(e.stack);
// }
//

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
