# mazaid-error

[![Code Climate](https://codeclimate.com/github/mazaid/error/badges/gpa.svg)](https://codeclimate.com/github/mazaid/error)
[![Test Coverage](https://codeclimate.com/github/mazaid/error/badges/coverage.svg)](https://codeclimate.com/github/mazaid/error/coverage)
[![Build Status](https://travis-ci.org/mazaid/error.svg?branch=master)](https://travis-ci.org/mazaid/error)

[![NPM](https://nodei.co/npm/mazaid-error.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mazaid-error/)


checkable errors

# install

```
npm i --save mazaid-error
```

# error format

```js
{
	message: '<error message>',
	code: '<error code, for example: notFound, invalidData>',
	entity: '<your service entity, for example: task, project, list ...>',
	list: [
		// human friendly error list in your custom format
		'title field required',
		// OR as object
		{
			message: 'field required',
			path: 'task.title'
		}

	]
}
```

# usage

## throw errors

```js
var error = require('mazaid-error');

// ...

throw error('my error message', 'myErrorCode')
		.setEntity('myEntity') // task - for example
		.setList([
			"some field required",
			"..."
		]);

// ...


```

## catch, check and process errors

```js

try {
	// some your code throw mazaid-error, or .catch promise or ...
} catch (e) {

	if (!e.checkable) {
		// error not mazaid-error
		// log error
		return;
	}

	e.checkChain(function (error) { /* default error callback */})
		// create check chain for entity == myEntity
		.ifEntity("myEntity")
		// if entity == 'myEntity' && code == 'myEntityErrorCode1'
		.ifCode('myEntityErrorCode1', function (error) { /* process error */ })
		.ifCode('myEntityErrorCode2', function (error) { /* process error */ })
		.end()
		.ifCode('someErrorCodeWithoutEntity', function (error) { /* process error */ })
		.check();
}

```

## parse and get error in your service clients

clients can get mazaid-errors and use check chains

For example, in http request

```js

var request = require('superagent');

var parseError = require('mazaid-error/parse');

request.get('/myservice/method').query({q: 'asdasd'})
    .end(function (err, res) {

        if (err) {

            var mazaidError = parseError(err, 'response.body.error');

            if (!mazaidError) {
                logger.fatal(err);
                // send 500 Server Error
                return;
            }

            mazaidError.checkChain(/* default error callback ... */)
                .ifEntity('myEntity')
                .ifCode('myEntityCode1,' function(error) {/* ... */}))
                .end()
                .check();

            return;
        }
    })

```

# License

MIT