var str='google 233';
var rule=new RegExp('google (.+)');
console.log(str.match(rule).pop());
