//// TODO: move to component file
document.addEventListener( "DOMContentLoaded", event => {
  // if NodeList doesn't support forEach, use Array's forEach()
  NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

  //////
  // Functions

  const isExpanded = elem => elem.getAttribute('aria-expanded') === 'true';

  const setAriaExpanded = ( elem, value ) => { elem.setAttribute('aria-expanded', value); };

  const openSubNav = ( trigger, level = 'lv1' ) => {
    closeAllSubNavs();
    trigger.classList.add( 'su-main-nav__item-' + level + '--expanded' );
    setAriaExpanded( trigger, 'true' );

    // set focus on the first link in the newly opened subnav
    let firstLink = trigger.querySelector( 'ul > li' ).firstElementChild; // no idea why 'ul > li > a' doesn't work???
    firstLink.focus();
  };

  const closeSubNav = ( trigger, level = 'lv1' ) => {
    trigger.classList.remove( 'su-main-nav__item-' + level + '--expanded' );
    setAriaExpanded( trigger, 'false' );
  };

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

  const openMobileNav = ( nav, toggle) => {
    closeAllMobileNavs();

    toggle.innerHTML = 'Close';
    setAriaExpanded( nav, 'true' );
    setAriaExpanded( toggle, 'true' );
    nav.querySelector( 'li > a' ).focus(); // Focus on the first top level link
  };

  const closeMobileNav = ( nav, toggle) => {
    toggle.innerHTML = 'Menu';
    setAriaExpanded( nav, 'false' );
    setAriaExpanded( toggle, 'false' );
  };

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
  // Code

  const navs = document.querySelectorAll( '.su-main-nav' ); // all main nav's
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
    const topLevelItems = nav.querySelectorAll( nav.tagName + " > ul > li" );

    mobileToggle.addEventListener( 'click', toggleMobileNav );

    topLevelItems.forEach( ( item ) => {
      const hasSubNav = item.lastElementChild.tagName === 'UL';
      if ( hasSubNav ) {
        subNavs.push( item ); // remember
        console.debug( "parent node found" );
        item.addEventListener( 'click', toggleSubNav );
      }
    } );
  } ); // navs.forEach

  document.addEventListener('click', ( event ) => {
    closeAllSubNavs();
    closeAllMobileNavs();
  }, false );
} ); // on DOMContentLoaded
