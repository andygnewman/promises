var promiseTest = new Promise(function(resolve) {
  resolve(JSON.parse("json"));
});

promiseTest.then(function(data) {
  alert("Promise fulfilled");
}, function(error) {
  alert("Promise rejected " + error);
});
