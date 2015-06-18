var PromiseMe = function() {

  var promState = {
    pending: 1, fulfilled: 2, rejected: 3
  };

  var PromiseMe = {
    myState: promState.pending,
    changeMyState: function(newState, newValue) {
      if (this.myState === newState) {
        throw new Error("Sorry but you can not transition to same state: " +
          newState);
      }

      if (this.myState === promState.fulfilled ||
        this.myState === promState.rejected) {
          throw new Error("You can not leave this state now: " + this.myState);
        }

      if (newState === promState.rejected && newValue === null) {
        throw new Error("If you get rejected you must have a reason, not null");
      }

      if (newState === promState.fulfilled && arguments.length <2) {
        throw new Error("Sorry you must have a non-null value to proceed to fulfilled");
      }

      this.myState = newState;
      this.value = newValue;
      this.resolve();
      return this.myState;
    },

    then: function(onFulfilled, onRejected) {
      this.handlers = this.handlers || [];
      var returnedPromise = Object.create(PromiseMe);

      var that = this;
      setTimeout(function() {
        that.handlers.push({
          fulfillPromise: onFulfilled,
          rejectPromise: onRejected,
          promise: returnedPromise
        });
        that.resolve();
      }, 2);
      return returnedPromise;
    },

    fulfillPromise: function(value) {
      this.changeMyState(promState.fulfilled, value);
    },

    rejectPromise: function(reason) {
      this.changeMyState(promState.rejected, reason);
    },

    resolve: function() {
      if (this.myState === promState.pending) {
        return false;
      }

      while(this.handlers && this.handlers.length) {
        var handler = this.handlers.shift();

        var doResolve = (this.myState == promState.fulfilled ?
          handler.fulfillPromise : handler.rejectPromise);

        if (typeof doResolve !== 'function') {
          handler.promise.changeMyState(this.myState, this.value);
        }
        else {
          try {
            var promiseValue = doResolve(this.value);
            if (promiseValue && typeof promiseValue.then === 'function') {
              promiseValue.then(function(val) {
                handler.promise.changeMyState(promState.fulfilled, val);
              }, function(error) {
                handler.promise.changeMyState(promState.rejected, error);
              });
            } else {
              handler.promise.changeMyState(promState.fulfilled, promiseValue);
            }
          } catch (error) {
            handler.promise.changeMyState(promState.rejected, error);
          }
        }
      }
    }

  };

  return Object.create(PromiseMe);
};


var multiplyMeAsync = function(val) {
  var promise = new PromiseMe();
  if (typeof val !== 'number') {
    promise.rejectPromise("Not a number");
  }
  else {
    promise.fulfillPromise(val * 2);
  }
  return promise;
};

var divideAsync = function(val) {
  console.log("divideAsync being called");
  var promise2 = new PromiseMe();
  if (val === 0) {
    console.log("being rejected");
    promise2.rejectPromise("Cannot divide by 0");
  }
  else {
    console.log("being fulfilled");
    promise2.fulfillPromise(1 / val);
  }
  return promise2;
};

var alertResult = function(value) {
  alert("Result is: " + value);
};

var onError = function(error) {
  alert("An error was encountered: " + error);
};

multiplyMeAsync(2).
  then(alertResult, onError);

multiplyMeAsync(0).
  then(divideAsync).
  then(alertResult, onError);
