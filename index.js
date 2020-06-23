"use strict";
(function() {
  window.addEventListener('load', init);

  function init() {
    document.getElementById('show-links').addEventListener('click', showLinks);
    document.getElementById('show-main').addEventListener('click', showMain);
  }

  function showLinks() {
    document.getElementById('links').classList.toggle('hidden');
    document.getElementById('links').scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    awaitScrollEnd(
      () => document.getElementById('main').classList.toggle('hidden')
    );
  }

  function showMain() {
    document.getElementById('main').classList.toggle('hidden');
    document.getElementById('links').scrollIntoView(true);
    setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 1);
    awaitScrollEnd(
      () => document.getElementById('links').classList.toggle('hidden')
    );
  }

  // thanks https://stackoverflow.com/a/51142522/
  function awaitScrollEnd(callback) {
    let timeout;
    function run() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        callback();
        window.removeEventListener('scroll', run);
      }, 100);
    }
    window.addEventListener('scroll', run);
  }
})();
