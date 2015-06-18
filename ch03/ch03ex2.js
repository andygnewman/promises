var log = document.getElementById("log");

var shout = new Promise(function(resolve) {
  log.insertAdjacentHTML('beforeend', '(<small>Promise started </small>)<br/>');
  window.setTimeout(
    function() {
      resolve('First Shout!');
    }, 2000);
});

shout.then(function(val) {
  addTextString(val);
  return "Shout Again!";
}).then(function(val) {
  addTextString(val);
  return "Third shout, you're out!";
}).then(function(val) {
  addTextString(val);
  return val;
});

function addTextString(val) {
  log.insertAdjacentHTML('beforeend', val + ' (<small>Promise fulfilled</small>)<br/>');
}
