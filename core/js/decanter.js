//// TODO: move to component file
document.addEventListener( "DOMContentLoaded", event => {
  // if NodeList doesn't support forEach, use Array's forEach()
  NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

  //////
  // Functions

  const isExpanded = elem => elem.getAttribute('aria-expanded') === 'true';

  const setAriaExpanded = ( elem, value ) => { elem.setAttribute('aria-expanded', value); }

  const toggleSubNav = event => {
    event = event || window.event;
    console.debug( "event: ", event );
    event.preventDefault();

    const target = event.target || event.srcElement; // the <a> element that was clicked
    const item = target.parentElement; // the <li> that contains the <a> element that was clicked
    const firstLink = target.nextElementSibling.querySelector( 'a' );
    console.debug( "target: ", target );
    console.debug( "item: ", item );
    console.debug( "firstLink: ", firstLink );

    if ( isExpanded( item ) ) {
      item.classList.remove( 'su-main-nav__item-lv1--expanded' );
      setAriaExpanded( item, 'false' );
      target.focus();
    }
    else {
      item.classList.add( 'su-main-nav__item-lv1--expanded' );
      setAriaExpanded( item, 'true' );
      firstLink.focus();
    }
  };

  const openMobileMenu = ( menu, toggle) => {
    const firstLink = menu.querySelector( 'li > a' );
    console.debug( 'firstLink: ', firstLink );

    toggle.innerHTML = 'Close';
    setAriaExpanded( menu, 'true' );
    setAriaExpanded( toggle, 'true' );
    firstLink.focus(); // Focus on the first top level link
  };

  const closeMobileMenu = ( menu, toggle) => {
    toggle.innerHTML = 'Menu';
    setAriaExpanded( menu, 'false' );
    setAriaExpanded( toggle, 'false' );
    toggle.focus(); // focus on the toggle
  };

  const toggleMobileMenu = event => {
    event = event || window.event;
    event.preventDefault();

    const toggle = event.target || event.srcElement; // the <button> element that was clicked
    const nav = toggle.parentElement;
    console.debug( 'toggle: ', toggle );
    console.debug( 'nav: ', nav );

    if ( isExpanded( nav ) ) {
      closeMobileMenu( nav, toggle );
    }
    else {
      openMobileMenu( nav, toggle );
    }
  };

  //////
  // Code

  const navs = document.querySelectorAll( '.su-main-nav' ); // find all main nav's

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

    mobileToggle.addEventListener( 'click', toggleMobileMenu );

    topLevelItems.forEach( ( item ) => {
      const secondLevelItems = item.querySelectorAll( item.tagName + " > ul > li" );
      const hasSubNav = secondLevelItems.length > 0;
      if ( hasSubNav ) {
        console.debug( "parent node found" );
        item.addEventListener( 'click', toggleSubNav );
      }
    } );
  } ); // navs.forEach
} ); // on DOMContentLoaded
