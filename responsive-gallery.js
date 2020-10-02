// --------------------------------------------------------------------------------------------------------
// SLIDER OBJECT
// --------------------------------------------------------------------------------------------------------


const sliderObject = {
    slideShow: document.querySelector('.magog-slides'), // Slideshow container
    slides: document.querySelectorAll('.magog-slide'), // All slides
    firstSlideImg: document.querySelector('.magog-slide img'), // The first slide image
    currentSlide: 0, // Current slide
    currentX: 0, // Starting position of slides
}
function defineProperties(){
    sliderObject.numberSlides = sliderObject.slides.length; // Total number of slides
    sliderObject.galleryWidth = sliderObject.firstSlideImg.width; // Width of the first slide image
    sliderObject.galleryHeight = sliderObject.firstSlideImg.height; // Height of the first slide image
    sliderObject.maxGalleryWidth = -(sliderObject.galleryWidth * (sliderObject.numberSlides-1)); // Combined width of all slides
}
defineProperties();

// add active class to first slide:
const setSlider = () => sliderObject.slides[0].classList.add('active-slide'); 
setSlider();

// --------------------------------------------------------------------------------------------------------
// SET HEIGHT
// --------------------------------------------------------------------------------------------------------
// Function to calculate height of slideshow:
function slideshowHeight(currentSlide) {
    // Set height of slideshow:
    sliderObject.galleryHeight = sliderObject.slides[currentSlide].querySelector('img').height; // calc the height of the image
    document.querySelector('.active-slide').style.height = `${sliderObject.galleryHeight}px`; // set height of slideshow to height of slide
    sliderObject.slideShow.style.height = `${sliderObject.galleryHeight}px`; // Also set height of overall gallery
}
// Set height according to first image:
slideshowHeight(0);


// --------------------------------------------------------------------------------------------------------
// RESIZE WINDOW
// --------------------------------------------------------------------------------------------------------
// Recalculate width, height and position when the window is resized:
window.addEventListener('resize', () => {
    // redefine object properties:
    defineProperties();
    sliderObject.currentX = -sliderObject.galleryWidth * sliderObject.currentSlide;
    sliderObject.slideShow.style.transition = "none"; // temporarily deactive slide animation during window resize
    sliderObject.slideShow.style.left = `${sliderObject.currentX}px`;
    slideshowHeight(sliderObject.currentSlide);
});

// Function to figure out when window has finished resizing:
function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,100,event);
  };
}
window.addEventListener('resize',debounce(function(){
  sliderObject.slideShow.style.transition = "all 0.35s"; // reactivate slide animation
}));


// --------------------------------------------------------------------------------------------------------
// ARROWS
// --------------------------------------------------------------------------------------------------------
// Arrows Navigation:
const arrowLeft = document.querySelector('.arrows .left');
const arrowRight = document.querySelector('.arrows .right');

// Move the slides on arrow click:
arrowRight.addEventListener("click", () => {
    moveSlides(-sliderObject.galleryWidth); // move slides to the left
});

arrowLeft.addEventListener("click", () => {
    moveSlides(sliderObject.galleryWidth); // move slides to the right
});

// Function to move the slides:
function moveSlides(distance) {
    sliderObject.currentX = sliderObject.currentX + distance; // calc current position
    // remove classes from arrows:
    arrowRight.classList.remove('inactive');
    arrowLeft.classList.remove('inactive');
    // remove active class from current slide
    document.querySelector('.active-slide').classList.remove('active-slide');
    // prevent the slider going out of bounds
    if(sliderObject.currentX > 0) {
        sliderObject.currentX = sliderObject.maxGalleryWidth;
        arrowLeft.classList.add('inactive');
    }
    if(sliderObject.currentX < sliderObject.maxGalleryWidth) {
        sliderObject.currentX = 0;
        arrowRight.classList.add('inactive');
    }
    sliderObject.slideShow.style.left = `${sliderObject.currentX}px`; // slide!
    // set the height to the next image:
    sliderObject.currentSlide = -sliderObject.currentX/sliderObject.galleryWidth; // calculate current slide number
    if (sliderObject.currentSlide < 1) { sliderObject.currentSlide = 0 } // prevent slide number being a negative
    sliderObject.slides[sliderObject.currentSlide].classList.add('active-slide');
    // Set height of slideshow:
    slideshowHeight(sliderObject.currentSlide);
    // set dot navigation styles:
    dotNavLis.forEach(dotNavLi => dotNavLi.classList.remove('active')); // remove active classes
    dotNavLis[sliderObject.currentSlide].classList.add('active')
}


// --------------------------------------------------------------------------------------------------------
// DOT NAVIGATION
// --------------------------------------------------------------------------------------------------------
// Create Dot Navigation:
function createDotNav(){
    const dotNav = document.querySelector('.dot-navigation ul');
    for(let i = 0; i < sliderObject.numberSlides; i++){
        // Create an LI for each slide and add a number to each:
        let dotNavLi = document.createElement('li');
        dotNav.appendChild(dotNavLi).setAttribute("data-slide", i);
    }
    dotNav.querySelector('li').classList.add('active');
}

createDotNav();

// Dot Navigation function:
const dotNavLis = document.querySelectorAll('.dot-navigation ul li');
// When each dot is clicked:
dotNavLis.forEach(dotNavLi => dotNavLi.addEventListener('click', () => {
    dotNavLis.forEach(dotNavLi => dotNavLi.classList.remove('active')); // remove active classes
    dotNavLi.classList.add('active'); // add active class to the clicked dot
    sliderObject.currentSlide = dotNavLi.getAttribute("data-slide"); // find current slide number
    sliderObject.currentX = -sliderObject.currentSlide * sliderObject.galleryWidth; // calc X position of slideshow
    sliderObject.slideShow.style.left = `${sliderObject.currentX}px`; // slide!
    // Set height of slideshow:
    slideshowHeight(sliderObject.currentSlide);
}));
    
