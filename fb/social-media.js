/** Save the UserId for later */
console.log('Safer Social Media loaded...');

let user;

function getUser() {
  let userElement = document.querySelector('.sideNavItem[data-type="type_user"][data-nav-item-id]');
  user = {
    id: userElement.getAttribute('data-nav-item-id'),
  };
}

getUser();

chrome.runtime.sendMessage({ user: user });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getUser();
    if (request.user) {
      sendResponse({ user: user });
    }
  }
);