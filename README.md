**aspect.js** is a JavaScript [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) library (simple, flexible, customizable)

##How to use?

Aspect(objectVariable).before('functionName', function(){
  // here is aspect BEFORE "functionName" in objectVariable
});

Aspect(objectVariable).after('functionName', function(){
  //  here is aspect AFTER "functionName" in objectVariable
});

Aspect(objectVariable).around('functionName', function(fn, args){
  //  here is aspect AROUND "functionName" in objectVariable
});

also supports filtration (if specified after/before aspect returns false - function execution will breaks)