**aspect.js** is a JavaScript [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) library (simple, flexible, customizable)

##How to use?

```javascript
var scope = {invoke: function(variable){
  return variable;
}};

Aspect(scope)
  .before('invoke', function(variable){
    // here is aspect BEFORE "invoke" in scope
    console.log("given argument for invoke function is: ", variable);
  }).after('invoke', function(invokeResult, variable){
    //  here is aspect AFTER "invoke" in scope
    console.log("initial invoke result with argument ", variable, " is ", invokeResult);
    return invokeResult * 2;
  }).around('invoke', function(innerFunction, args){
    //  here is aspect AROUND "invoke" in scope (we do not change arguments and initial function)
    return innerFunction.apply(this, args);
  });

// and not we call method
scope.invoke(25)
```
also supports filtration (if specified after/before aspect returns false - function execution will breaks)

##Extensibility
* Add or remove function using Aspect() using add/remove functions
* Add other aspects (except before, after, around... see source)