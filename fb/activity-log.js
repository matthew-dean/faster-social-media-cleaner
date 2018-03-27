console.log('Hello from activity log');

function showOverlay() {
  let overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = '<div class="overlay-content">Processing activity...</div>';

  document.body.appendChild(overlay);
}

let totalLoaderCount = 0;

function openSectionLoaders() {
  let loaders = document.querySelectorAll('[data-sigil="timeline-section"]:not(.loadedSection)');
  let length = loaders.length;
  totalLoaderCount += length;
  console.log('Found ' + length + ' loaders...');

  chrome.runtime.sendMessage({ 
    loaderCount: totalLoaderCount
  });

  if (length === 0) {
    return findDropDowns();
  }

  let observers = new Array(length);

  function mutated(i) {
    length--;
    console.log(length + ' remaining...');
    observers[i].disconnect();
    loaders[i].scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});

    if (length === 0) {
      observers = null;
      setTimeout(openSectionLoaders, 1000);
    }
  }

  loaders.forEach(function(el, i) {
    let observeElement = el;

    /** Observe the parent, this node will be removed */
    if (el.id.indexOf('_more') > -1) {
      observeElement = el.parentNode;
    }

    observers[i] = new MutationObserver(mutated.bind(this, [i]));
    observers[i].observe(observeElement, { childList: true, subtree: true });
    el.childNodes[0].click();
  });
}

function findDropDowns() {
  console.log('Scanning dropdowns...');
  let dropdowns = document.querySelectorAll('[data-sigil~="flyout-causal"]');
  dropdowns = Array.prototype.slice.call(dropdowns);
  let length = dropdowns.length;

  let flyoutContainer = document.querySelector('#root');
  let flyoutObserver = new MutationObserver(function(mutations) {

    for(var mutation of mutations) {
      if (mutation.type === 'childList') {
        if (mutation.addedNodes.length === 0) {
          return;
        }
        let dropdownLinks = mutation.addedNodes[0].querySelectorAll('a.touchable');

        console.log('Found links...' + dropdownLinks.length);

        let hideLink, deleteLink;

        dropdownLinks.forEach(function(d) {
          if (d.childNodes[0].innerHTML.indexOf('Hide') > -1) {
            hideLink = d;
          }
          if (d.childNodes[0].innerHTML.indexOf('Delete') > -1) {
            deleteLink = d;
          }
        });

        console.log(hideLink, deleteLink);

        if (deleteLink) {
          deleteLink.click();
        }
        if (hideLink) {
          hideLink.click();
        }

        setTimeout(doNext, 250);
      }
    }
  });

  flyoutObserver.observe(flyoutContainer, { childList: true });

  function doNext() {
    chrome.runtime.sendMessage({ 
      items: dropdowns.length,
      remaining: length
    });

    length--;
    console.log('Changes remaining...' + length);
    if(length === 0) {
      //chrome.runtime.sendMessage({ finished: true });
      console.log('Finished!');
    }
    else {
      try {
        let el = dropdowns.pop();
        console.log(el);
        el.click();
      }
      catch(ex) {
        console.log(ex);
        doNext();
      }
    }
  }

  setTimeout(doNext, 250);

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    showOverlay();
    openSectionLoaders();
    return true;
  }
);

chrome.runtime.sendMessage({ ready: true });