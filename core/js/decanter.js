//// TODO: move to component file
document.addEventListener( "DOMContentLoaded", event => {

  const navClass = 'su-main-nav';

  // if NodeList doesn't support forEach, use Array's forEach()
  NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

  //////
  // Functions

  const showingDesktopNav = () => getComputedStyle( aMobileToggle ).display === 'none';

  const isExpanded = elem => elem.getAttribute('aria-expanded') === 'true';

  const setAriaExpanded = ( elem, value ) => { elem.setAttribute('aria-expanded', value); };

  const hasSubNav = elem => ( elem.tagName.toUpperCase() == 'LI' && elem.lastElementChild.tagName.toUpperCase() === 'UL' );

  const getNextLevelItems = elem => elem.querySelectorAll( elem.tagName + " > ul > li" );

  const getNav = elem => {
    console.debug( 'getNav: elem: ', elem );
    do {
      elem = elem.parentElement;
      // console.debug( 'getNav: elem: ', elem );
    } while ( elem && !elem.classList.contains( navClass ) );
    return elem || false;
  };

  const getSubNav = elem => {
    console.debug( 'getSubNav: elem: ', elem );
    do {
      elem = elem.parentElement;
      // console.debug( 'getSubNav: elem: ', elem );
    } while ( elem && !hasSubNav( elem ) );
    return elem || false;
  };

  const openSubNav = ( trigger, level = 'lv1' ) => { //// TODO: remove level when scss no longer refers to it
    closeAllSubNavs();

    if ( trigger ) {
      trigger.classList.add( 'su-main-nav__item-' + level + '--expanded' );
      setAriaExpanded( trigger, 'true' );

      // set focus on the first link in the newly opened subnav
      let firstLink = trigger.querySelector( 'ul > li' ).firstElementChild; // no idea why 'ul > li > a' doesn't work???
      firstLink.focus();
    }
  };

  const closeSubNav = ( trigger, level = 'lv1' ) => {
    if ( trigger ) {
      trigger.classList.remove( 'su-main-nav__item-' + level + '--expanded' );
      setAriaExpanded( trigger, 'false' );
    }
  };

  // click handler for subnav triggers
  const toggleSubNav = event => {
    event = event || window.event;
    event.preventDefault();
    event.stopPropagation();

    const target = event.target || event.srcElement; // the <a> element that was clicked
    const item = target.parentElement; // the <li> that contains the <a> element that was clicked

    if ( isExpanded( item ) ) {
      closeSubNav( item );
    }
    else {
      openSubNav( item );
    }
  };

  const openMobileNav = ( nav, toggle ) => {
    closeAllMobileNavs();

    if ( nav ) {
      toggle = toggle || nav.querySelector( nav.tagName + ' > button' );
      toggle.innerHTML = 'Close';
      setAriaExpanded( nav, 'true' );
      setAriaExpanded( toggle, 'true' );
      nav.querySelector( 'li > a' ).focus(); // Focus on the first top level link
    }
  };

  const closeMobileNav = ( nav, toggle ) => {
    if ( nav ) {
      toggle = toggle || nav.querySelector( nav.tagName + ' > button' );
      toggle.innerHTML = 'Menu';
      setAriaExpanded( nav, 'false' );
      setAriaExpanded( toggle, 'false' );
    }
  };

  // click handler for hamburger icon (mobile menu toggle)
  const toggleMobileNav = event => {
    event = event || window.event;
    event.preventDefault();
    event.stopPropagation();

    const toggle = event.target || event.srcElement; // the <button> element that was clicked
    const nav = toggle.parentElement;

    if ( isExpanded( nav ) ) {
      closeMobileNav( nav, toggle );
    }
    else {
      openMobileNav( nav, toggle );
    }
  };

  const closeAllSubNavs = () => { subNavs.forEach( subNav => { closeSubNav( subNav ); } ); };

  const closeAllMobileNavs = () => { navs.forEach( ( nav ) => { closeMobileNav( nav, nav.querySelector( 'button' ) ); } ); };

  //////
  // Keyboard interaction

  // helper functions
  const isHome = theKey => ( theKey === 'Home' || theKey === 122 );
  const isEnd = theKey => ( theKey === 'End' || theKey === 123 );
  const isTab = theKey => ( theKey === 'Tab' || theKey === 9 );
  const isEsc = theKey => ( theKey === 'Escape' || theKey === 'Esc' || theKey === 27 );
  const isSpace = theKey => ( theKey === ' ' || theKey === 'Spacebar' || theKey === 32 );
  const isEnter = theKey => ( theKey === 'Enter' || theKey === 13 );
  const isLeftArrow = theKey => ( theKey === 'ArrowLeft' || theKey === 'Left' || theKey === 37 );
  const isRightArrow = theKey => ( theKey === 'ArrowRight' || theKey === 'Right' || theKey === 39 );
  const isUpArrow = theKey => ( theKey === 'ArrowUp' || theKey === 'Up' || theKey === 38 );
  const isDownArrow = theKey => ( theKey === 'ArrowDown' || theKey === 'Down' || theKey === 40 );

  // keydown handlers
  const keyDownTopNav = event => {
    event = event || window.event;
    event.stopPropagation();

    const target = event.target || event.srcElement; // the element that had focus when the key was pressed (presumably an <a> element)
    const theKey = event.key || event.keyCode;
    const theNav = getNav( target );
    const theSubNav = getSubNav( target );
    const topLevelItems = getNextLevelItems( theNav );
    const firstLink = topLevelItems[0].querySelector( 'a' );
    const lastLink = topLevelItems[ topLevelItems.length - 1 ].querySelector( 'a' );
    const desktop = showingDesktopNav();

    console.debug( 'You pressed the ', theKey, ' key on target ', target );
    console.debug( 'theNav: '   , theNav    );
    console.debug( 'theSubNav: ', theSubNav );
    console.debug( 'firstLink: ', firstLink );
    console.debug( 'firstLink: ', firstLink );
    console.debug( 'lastLink: ' , lastLink  );


    if ( isEsc( theKey ) ) {
      if ( desktop ) closeAllSubNavs();
      else closeAllMobileNavs();
    }
    else if ( isHome( theKey ) ) {
      firstLink.focus(); // Focus on the first top level menu link when HOME button is pressed
    }
    else if ( isEnd( theKey ) ) {
      lastLink.focus(); // Focus on the last top level menu link when END button is pressed
    }
    else if ( ( isSpace( theKey ) || isEnter( theKey ) ) && theSubNav ) {
      event.preventDefault();
      openSubNav( theSubNav );
    }
  };


  //////
  // Code

  const navs = document.querySelectorAll( '.' + navClass ); // all main nav's
  let aMobileToggle = null; // the first mobile toggle we find - used to determine if we're displaying mobile or desktop nav
  let subNavs = []; // array of subnavs to be closed by closeAllSubNavs();

  // if more than 1 main nav, assign lower z-index to main navs lower on the page so they don't cover each other up
  if ( navs.length > 1 ) {
    const firstZindex = getComputedStyle( navs[ 0 ], null ).zIndex;
    for ( let i = 1; i < navs.length; i++ ) {
      navs[ i ].style.zIndex = firstZindex - 300 * i;
    }
  }

  // process each nav element
  navs.forEach( ( nav, index ) => {
    const mobileToggle = nav.querySelector( nav.tagName + " > button" );
    const topLevelItems = getNextLevelItems( nav );

    mobileToggle.addEventListener( 'click', toggleMobileNav );
    if ( aMobileToggle === null ) aMobileToggle = mobileToggle;

    topLevelItems.forEach( item => {
      item.addEventListener( 'keydown', keyDownTopNav );

      if ( hasSubNav( item ) ) {
        subNavs.push( item ); // remember the subnavs for closeAllSubNavs()
        item.addEventListener( 'click', toggleSubNav );
      }
    } );
  } ); // navs.forEach

  document.addEventListener('click', ( event ) => {
    closeAllSubNavs();
    closeAllMobileNavs();
  }, false );

} ); // on DOMContentLoaded
