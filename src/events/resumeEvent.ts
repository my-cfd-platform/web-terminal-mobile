export default () => {
  let timestamp = new Date().getTime();

  function checkResume() {
    const current = new Date().getTime();
    if (current - timestamp > 4000) {
      var event = document.createEvent('Events');
      event.initEvent('resume', true, true);
      document.dispatchEvent(event);
    }
    timestamp = current;
  }

  window.setInterval(checkResume, 1000);
};
