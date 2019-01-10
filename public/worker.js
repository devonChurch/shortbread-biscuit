onmessage = function(event) {
  console.log("inside the worker...", event);
  postMessage(`you wrote... ${event.data}`);
};
