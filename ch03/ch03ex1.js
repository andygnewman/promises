var timeoutSet;

var promiseObj = function(time) {
  return new Promise(function(resolve) {
    timeoutSet = time;
    setTimeout(resolve, time);
  });
};

promiseObj(3000).then(function() {
  alert("promise 1 " + timeoutSet);
}).then(function() {
    alert("another promise " + timeoutSet);
});
