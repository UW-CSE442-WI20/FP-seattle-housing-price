var fullpage = require('./fullpage');

var myFullpage = new fullpage('#fullpage', {
	//Navigation
    menu: '#menu',
    lockAnchors: false,
    anchors:['firstPage', 'secondPage',  'thirdPage', 'fourthPage', 'fifthPage'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['first', 'second', 'third', 'fourth', 'fifth'],
    // showActiveTooltip: false,
    // slidesNavigation: true,
    // slidesNavPosition: 'bottom',

    //Scrolling
    css3: true,
    scrollingSpeed: 700,
    autoScrolling: true,
    fitToSection: false,
    fitToSectionDelay: 100,
    scrollBar: false,
    easing: 'easeInOutCubic',
    easingcss3: 'ease',
    loopBottom: false,
    loopTop: false,
    loopHorizontal: true,
    continuousVertical: false,
    continuousHorizontal: false,
    scrollHorizontally: false,
    interlockedSlides: false,
    dragAndMove: false,
    offsetSections: false,
    resetSliders: false,
    fadingEffect: false,
    normalScrollElements: '#element1, .element2',
    scrollOverflow: false,
    scrollOverflowReset: false,
    scrollOverflowOptions: null,
    touchSensitivity: 15,
    normalScrollElementTouchThreshold: 5,
    bigSectionsDestination: null,

    //Accessibility
    keyboardScrolling: true,
    animateAnchor: true,
    recordHistory: true,

    //Design
    controlArrows: true,
    verticalCentered: false,
    //sectionsColor : ['#fcfcfc', '#fcfcfc'],
    //paddingTop: '0em',
    paddingBottom: '10px',
    fixedElements: '#header, .footer',
    responsiveWidth: 0,
    responsiveHeight: 0,
    responsiveSlides: false,
    parallax: false,
    parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},

    //Custom selectors
    sectionSelector: '.section',
    slideSelector: '.slide',

    lazyLoading: true,

    //events
    onLeave: function(index, nextIndex, direction){},
    afterLoad: function(origin, destination, direction){},
    afterRender: function(){},
    afterResize: function(){},
    afterResponsive: function(isResponsive){},
    afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
    onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
});

const busData = require('./data/bus_stations_by_zip_code.json');
const companyData = require('./data/company_by_zip_code.json');
const crimeData = require('./data/crime_by_zip_code.json');
const groceryData = require('./data/grocery_by_zip_code.json');
const priceData = require('./data/housing_price_by_zip_code.json');
const linkData = require('./data/link_stations_by_zip_code.json');
const restData = require('./data/restaurants_by_zip_code.json');
const schoolData = require('./data/schools_by_zip_code.json');
const zipData = require('./data/zipcode.json');

const zipMap = require('./zipMap');
const zipMapInstance = new zipMap();
zipMapInstance.drawMap(zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData);