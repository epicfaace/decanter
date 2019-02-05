NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach; // Make node lists behave like arrays
const mainNav = document.getElementById('su-main-nav');
const mainMenu = mainNav.querySelector('.su-main-nav__menu-lv1');
const mainNavToggle = document.getElementById('su-main-nav__toggle');
const mobileSearch = mainNav.querySelector('.su-site-search');

const parents = mainMenu.querySelectorAll('.su-main-nav__item-lv1--parent');
const parentLinks = mainMenu.querySelectorAll('.su-main-nav__item-lv1--parent > a');
const level1Links = mainMenu.querySelectorAll('.su-main-nav__item-lv1 > a');
const level2Links = mainMenu.querySelectorAll('.su-main-nav__item-lv2 > a');
const firstLink = mainMenu.firstElementChild.querySelector('a');
const lastLink = mainMenu.lastElementChild.querySelector('a');

// Function to check if an element has aria-expanded set to true
const isExpanded = x => x.getAttribute('aria-expanded') === 'true';

// Function to check if we're using desktop version of main nav (horizontal)
// If menu toggle button is not shown, then we're on desktop and return true
const isDesktop = () => getComputedStyle(mainNavToggle, null).display === 'none';

// Function to check if a search box is included for the mobile menu
const hasMobileSearch = () => getComputedStyle(mobileSearch, null).display !== 'none';

// function to check if there are open subnavs
const hasOpenSubnav = () => {
  let numOpenSubnav = 0;
  for (let i=0; i < parentLinks.length; i++) {
    if ( isExpanded( parentLinks[i] ) ) {
      numOpenSubnav ++;
      if ( numOpenSubnav > 0 ) {
        break;
      }
    }
  }
  return numOpenSubnav > 0;
};

const ariaSetTrue = x => x.setAttribute('aria-expanded', 'true');
const ariaSetFalse = x => x.setAttribute('aria-expanded', 'false');

const expandMenu = x => {
  x.classList.add('su-main-nav__item-lv1--expanded');
  ariaSetTrue( x.querySelector('a') );
};

const collapseMenu = x => {
  x.classList.remove('su-main-nav__item-lv1--expanded');
  ariaSetFalse( x.querySelector('a') );
};

const openMobileMenu = () => {
  ariaSetTrue( mainNavToggle );
  ariaSetTrue( mainMenu );
  firstLink.focus(); // Focus on the first top level link
  mainNavToggle.innerHTML = 'Close';
};

const closeMobileMenu = () => {
  ariaSetFalse( mainNavToggle );
  ariaSetFalse( mainMenu );
  mainNavToggle.focus(); // Return focus to the toggle button
  mainNavToggle.innerHTML = 'Menu';
};

const closeAllOpenSubnavs = () => {
  for (let i=0; i < parentLinks.length; i++) {
    if ( isExpanded( parentLinks[i] ) ) {
      collapseMenu( parents[i] );
    }
  }
};

// ---------------------------------
// Add click listeners to top level menu items and links
// ---------------------------------
for (let i=0; i < parents.length; i++) {
  parents[i].addEventListener('click', function(e) {
    e = e || window.event;
    if ( !(isExpanded( parentLinks[i] )) ) {
      closeAllOpenSubnavs(); // First close all opened drop down menus
      // Toggle 2nd level menu
      expandMenu( parents[i] );
      parents[i].querySelector('.su-main-nav__menu-lv2 > li:first-child > a').focus(); // focus on first subnav link
    } else {
      collapseMenu( parents[i] );
    }
  }, false);

  // Make parent links inactive and act as drop down toggles
  parentLinks[i].addEventListener('click', function(e) {
    e = e || window.event;
    e.preventDefault();
  });
}

// ---------------------------------
// When there are open subnavs, click anywhere on the site to close them (except when click on another parent link)
// ---------------------------------
document.addEventListener('click', function(e) {
  e = e || window.event; // Use e if it exists or e will be equal to window.event for IE
  const eventElement = e.target || e.srcElement; // e.srcElement is IE equiv of e.target
  if ( !eventElement.closest('.su-main-nav__item-lv1--parent') ) {
    closeAllOpenSubnavs();
  }
}, false);

// ---------------------------------
// Toggle hamburger button and changes button text
// ---------------------------------
mainNavToggle.addEventListener('click', function(e) {
  if ( isExpanded( mainNavToggle ) ) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}, false);

// ---------------------------------
// Listens to keydown event while menu toggle button is focused
// ---------------------------------
mainNavToggle.onkeydown = function(e) {
  e = e || window.event;
  const press = e.key || e.keyCode; // fallback to keyCode if key isn't supported by older browsers

  // Close mobile menu if ESC is pressed, open if Spacebar or Enter key is pressed
  if ( ( press === 'Escape' || press === 'Esc' || press === 27 ) && isExpanded( mainNavToggle ) ) {
    closeMobileMenu();
  } else if ( ( press === ' ' || press === 'Spacebar' || press === 'Enter' || press === 32 || press === 13 ) && !isExpanded( mainNavToggle ) ) {
    e.preventDefault();
    openMobileMenu();
  }
};

// ---------------------------------
// Listens to keydown event while mobile site search is focused
// ---------------------------------
mobileSearch.onkeydown = function(e) {
  e = e || window.event;
  const press = e.key || e.keyCode; // fallback to keyCode if key isn't supported by older browsers

  // Close mobile menu if ESC is pressed
  if ( (press === 'Escape' || press === 'Esc' || press === 27) && isExpanded(mainNavToggle) ) {
    closeMobileMenu();
  }
};

// ---------------------------------
// listens to keydown on top level links
// ---------------------------------
for (let i=0; i < level1Links.length; i++) {
  level1Links[i].addEventListener('keydown', function (e) {
    e = e || window.event;
    const press = e.key || e.keyCode;
    const currentFocus = document.activeElement;
    const isLevel1Parent = () => currentFocus.parentNode.classList.contains('su-main-nav__item-lv1--parent');

    if ( press === 'Home' || press === 122 ) {
      firstLink.focus(); // Focus on the first top level menu link when HOME button is pressed
    } else if ( press === 'End' || press === 123 ) {
      lastLink.focus(); // Focus on the last top level menu link when END button is pressed
    } else if ( ( press === ' ' || press === 'Spacebar' || press === 'Enter' || press === 32 || press === 13 ) && isLevel1Parent() ) {
      expandMenu( currentFocus.parentNode );
      e.preventDefault();
      currentFocus.parentNode.querySelector('.su-main-nav__menu-lv2 > li:first-child > a').focus();
    }

    if ( isDesktop() ) {

      if ( ( press === 'ArrowDown' || press === 'Down' || press === 40 ) && isLevel1Parent() ) {
        expandMenu( currentFocus.parentNode );
        e.preventDefault(); // prevent page scrolling
        currentFocus.parentNode.querySelector('.su-main-nav__menu-lv2 > li:first-child > a').focus();
      } else if ( press === 'ArrowRight' || press === 'Right' || press === 39 ) {
        e.preventDefault();
        closeAllOpenSubnavs();
        if (currentFocus === lastLink) {
          firstLink.focus();
        } else {
          currentFocus.parentNode.nextElementSibling.querySelector('a').focus();
        }
      } else if ( press === 'ArrowLeft' || press === 'Left' || press === 37 ) {
        e.preventDefault();
        closeAllOpenSubnavs();
        if (currentFocus === firstLink) {
          lastLink.focus();
        } else {
          currentFocus.parentNode.previousElementSibling.querySelector('a').focus();
        }
      } else if ( press === 'Escape' || press === 'Esc' || press === 27 ) {
        closeAllOpenSubnavs();
      }

    } else if ( !isDesktop() ) {

      if ( press === 'ArrowDown' || press === 'Down' || press === 40 ) {
        e.preventDefault();
        if (currentFocus === lastLink) {
          firstLink.focus();
        } else {
          currentFocus.parentNode.nextElementSibling.querySelector('a').focus();
        }
      } else if ( press === 'ArrowUp' || press === 'Up' || press === 38 ) {
        e.preventDefault();
        if (currentFocus === firstLink) {
          lastLink.focus();
        } else {
          currentFocus.parentNode.previousElementSibling.querySelector('a').focus();
        }
      } else if ( press === 'Escape' || press === 'Esc' || press === 27 ) {
        closeAllOpenSubnavs();
        if ( !hasOpenSubnav() && isExpanded( mainNavToggle ) ) {
          closeMobileMenu();
        }
      }

    }

  }, false);
}

// ---------------------------------
// listens to keydown on 2nd level subnav links
// ---------------------------------
for (let i=0; i < level2Links.length; i++) {
  level2Links[i].addEventListener('keydown', function (e) {
    e = e || window.event;
    const press = e.key || e.keyCode;
    const currentFocus = document.activeElement;
    const firstSubnavLink = currentFocus.parentNode.parentNode.firstElementChild.querySelector('a');
    const lastSubnavLink = currentFocus.parentNode.parentNode.lastElementChild.querySelector('a');
    const parentMenuItem = currentFocus.parentNode.parentNode.parentNode;

    if ( press === 'ArrowDown' || press === 'Down' || press === 40 ) {
      e.preventDefault();
      if (currentFocus === lastSubnavLink) {
        firstSubnavLink.focus();
      } else {
        currentFocus.parentNode.nextElementSibling.querySelector('a').focus();
      }
    } else if ( press === 'ArrowUp' || press === 'Up' || press === 38 ) {
      e.preventDefault();
      if (currentFocus === firstSubnavLink) {
        lastSubnavLink.focus();
      } else {
        currentFocus.parentNode.previousElementSibling.querySelector('a').focus();
      }
    } else if ( (press === 'Tab' || press === 9 ) && ( currentFocus === lastSubnavLink ) ) { // hitting TAB while on last submenu link closes submenu
      collapseMenu( parentMenuItem );
    } else if ( press === 'Home' || press === 122 ) {
      firstSubnavLink.focus(); // Focus on the first subnav link when HOME button is pressed
    } else if ( press === 'End' || press === 123 ) {
      lastSubnavLink.focus(); // Focus on the last subnav link when END button is pressed
    } else if ( ( press === 'Escape' || press === 'Esc' || press === 27 ) && hasOpenSubnav() ) {
      parentMenuItem.classList.remove('su-main-nav__item-lv1--expanded');
      parentLinks.forEach( ariaSetFalse );
      parentMenuItem.querySelector('a').focus();
    }

    if ( isDesktop() ) {
      if (press === 'ArrowRight' || press === 'Right' || press === 39) {
        collapseMenu( parentMenuItem );
        e.preventDefault();
        if ( parentMenuItem.querySelector('a') !== lastLink ) {
          parentMenuItem.nextElementSibling.querySelector('a').focus();
        } else {
          firstLink.focus();
        }
      } else if (press === 'ArrowLeft' || press === 'Left' || press === 37) {
        collapseMenu( parentMenuItem );
        e.preventDefault();
        if ( parentMenuItem.querySelector('a') !== firstLink ) {
          parentMenuItem.previousElementSibling.querySelector('a').focus();
        } else {
          lastLink.focus();
        }
      }
    }

  }, false);
}

// ---------------------------------
// Debounce function: Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// ---------------------------------
function debounce( func, wait, immediate ) {
  let timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if ( !immediate ) func.apply( context, args );
    };
    var callNow = immediate && !timeout;
    clearTimeout( timeout );
    timeout = setTimeout( later, wait );
    if ( callNow ) func.apply( context, args );
  };
}

// ---------------------------------
// Listens to when window finishes resizing (after 250 ms), if menu is desktop version and menu toggle aria is expanded, set it to false
// ---------------------------------
const closeButtonWhenDesktop = debounce(function() {
  if ( isDesktop() && isExpanded( mainNavToggle ) ) {
    ariaSetFalse( mainNavToggle );
    mainNavToggle.innerHTML = 'Menu';
    mainMenu.removeAttribute('aria-expanded'); // no need for aria-expanded attribute when on desktop
  }
}, 250);

window.addEventListener( 'resize', closeButtonWhenDesktop );