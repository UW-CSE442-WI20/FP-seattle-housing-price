var fullpage = require('./fullpage');

var myFullpage = new fullpage('#fullpage', {
	//Navigation
    menu: '#menu',
    lockAnchors: false,
    anchors:['firstPage', 'secondPage',  'thirdPage', 'fourthPage', 'fifthPage', 'sixthPage', 'sevenPage', 'eightPage', 'ninePage', 'tenPage', 'elevenpage', 'twelvePage' ,'thirteenPage'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Introduction', 'GDP', 'Factors', 'Company', 'Transportation', 'Crime', 'School', 'Restaurant', 'Grocery Store', 'Section Summary', 'Zip code Comparison', 'Best Area Search', 'Source & About Us'],
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
const gdpData = require('./data/gdp_vs_avg_housing');
const d3 = require('d3');

const zipMap = require('./zipMap');
const zipMapInstance = new zipMap();
zipMapInstance.drawMap(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData);

const schoolMap = require('./schoolMap');
const schoolMapInstance = new schoolMap();
schoolMapInstance.drawMap(d3, zipData, schoolData, priceData);


const groceryMap = require('./groceryMap');
const groceryMapInstance = new groceryMap();
groceryMapInstance.drawMap(d3, zipData, groceryData, priceData);

const restaurantMap = require('./restaurantMap');
const restaurantMapInstance = new restaurantMap();
restaurantMapInstance.drawMap(d3, zipData, restData, priceData);

const companyMap = require('./companyMap');
const companyMapInstance = new companyMap();
companyMapInstance.drawMap(d3, zipData, companyData, priceData);

const busMap = require('./busMap');
const busMapInstance = new busMap();
busMapInstance.drawMap(d3, zipData, busData, linkData, priceData);

const crimeMap = require('./crimeMap');
const crimeMapInstance = new crimeMap();
crimeMapInstance.drawMap(d3, zipData, crimeData, priceData);


const bestZip = require('./bestZip');
const bestZipInstance = new bestZip();
bestZipInstance.drawGraph(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData, false);


const gdp = require('./gdp');
const gdpInstance = new gdp();
gdpInstance.drawMap(d3, gdpData);

window.addEventListener("resize", redraw);


function redraw() {
    d3.selectAll("svg").remove();
    zipMapInstance.drawMap(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData);
    schoolMapInstance.drawMap(d3, zipData, schoolData, priceData);
    gdpInstance.drawMap(d3, gdpData);

    groceryMapInstance.drawMap(d3, zipData, groceryData, priceData);
    restaurantMapInstance.drawMap(d3, zipData, restData, priceData);
    companyMapInstance.drawMap(d3, zipData, companyData, priceData);
    busMapInstance.drawMap(d3, zipData, busData, linkData, priceData);
    crimeMapInstance.drawMap(d3, zipData, crimeData, priceData);

    bestZipInstance.drawGraph(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData, true);
}
