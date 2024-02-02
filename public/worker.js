self.addEventListener('message', function (e) {
  if (e.data.type === 'start-loop') {
    setInterval(function () {
      self.postMessage({
        type: 'workder-msg',
        time: new Date().toLocaleString(),
        data: e.data,
      });
    }, e.data.delay);
  }
});
