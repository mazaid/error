# mazaid-error

[![Code Climate](https://codeclimate.com/github/mazaid/error/badges/gpa.svg)](https://codeclimate.com/github/mazaid/error)
[![Test Coverage](https://codeclimate.com/github/mazaid/error/badges/coverage.svg)](https://codeclimate.com/github/mazaid/error/coverage)
[![Build Status](https://travis-ci.org/mazaid/error.svg?branch=master)](https://travis-ci.org/mazaid/error)


checkable errors

# install

```
npm i --save mazaid-error
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

# License

MIT