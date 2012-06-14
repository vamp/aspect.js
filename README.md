**aspect.js** is a JavaScript [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) library (simple, flexible, customizable)

##How to use?

object case:

```javascript
var scope = {resolveState: function(state){
  return state ? 'VALID' : 'INVALID';
}};


Aspect(scope)
	// before sample
	.before('resolveState',
		// log input parameter
		function(state){
			console.log('scope.resolveState(', state, ') called');
		},

		// basic filtration (breaks function execution if any value returns and return this value as function result)
		// add this before "log"
		function(state){
			if(state!==true && state!==false){
				return "Invalid parameter 'state' for resolveState function";
			}
		}
	)

	// around sample
	.around('resolveState', function(innerFunction, args){
		// invert "state" parameter
		console.log("invert state parameter from '", args[0], "' to '", !args[0], "'");
		return innerFunction.call(this, !args[0]);
	})

	// after sample
	// only log arguments & result
	.after('resolveState', function(result, state){
		console.log('scope.resolveState(', state, ') = ', result);
	})
```

Function case:
```javascript

// Using in function case:
var pow = function(variable){
  return variable * variable;
};


// create new function (also you can reassing existing)
var tripplePow = Aspect(pow).before(function(variable){
	console.log("POW(", variable, ") called");
}).after(function(result, variable){
	return result*variable;
});

```

Additional features:
```javascript

// After first aspect call on function you can use next syntax:
scope.resolveState.after(function(){
  // here is your logic
});

// Getting list of handlers
var afterHandlers = tripplePow.after.valueOf();

// Remove all handlers
for(var i=0, j=afterHandlers.length; i<j; i++){
  tripplePow.after.remove(afterHandlers[i]);
}
```


##Extensibility
* Add or remove function using Aspect() using add/remove functions
* Add other aspects (except before, after, around... see source)