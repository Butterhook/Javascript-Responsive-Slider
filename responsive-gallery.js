(function() {
// --------------------------------------------------------------------------------------------------------
// BINDINGS
// --------------------------------------------------------------------------------------------------------
let slideShow = document.querySelector('.magog-slides'), // Slideshow container
    slides = document.querySelectorAll('.magog-slide'), // All slides
    firstSlideImg = document.querySelector('.magog-slide img'), // The first slide image
    numberSlides = slides.length, // Total number of slides
    galleryWidth = firstSlideImg.width, // Width of the first slide image
    galleryHeight = firstSlideImg.height, // Height of the first slide image
    maxGalleryWidth = -(galleryWidth * (numberSlides-1)), // Combined width of all slides
    currentSlide = 0, // Current slide
    currentX = 0; // Starting position of slides


// add active class to first slide:
function setSlider() {
    slides[0].classList.add('active-slide'); 
}
window.onload = setSlider();


// --------------------------------------------------------------------------------------------------------
// SET HEIGHT
// --------------------------------------------------------------------------------------------------------
// Function to calculate height of slideshow:
function slideshowHeight(currentSlide) {
    // Set height of slideshow:
    galleryHeight = slides[currentSlide].querySelector('img').height; // calc the height of the image
    document.querySelector('.active-slide').style.height = `${galleryHeight}px`; // set height of slideshow to height of slide
    slideShow.style.height = `${galleryHeight}px`; // Also set height of overall gallery
}

// Set height according to first image:
slideshowHeight(0);


// --------------------------------------------------------------------------------------------------------
// RESIZE WINDOW
// --------------------------------------------------------------------------------------------------------
// Recalculate width, height and position when the window is resized:
window.addEventListener('resize', () => {
    // redefine bindings:
    galleryWidth = firstSlideImg.width;
    galleryHeight = firstSlideImg.height;
    maxGalleryWidth = -(galleryWidth * (numberSlides-1));
    currentX = -galleryWidth * currentSlide;
    slideShow.style.transition = "none"; // temporarily deactive slide animation during window resize
    slideShow.style.left = `${currentX}px`;
    slideshowHeight(currentSlide);
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
  slideShow.style.transition = "all 0.35s"; // reactivate slide animation
}));


// --------------------------------------------------------------------------------------------------------
// ARROWS
// --------------------------------------------------------------------------------------------------------
// Arrows Navigation:
const arrowLeft = document.querySelector('.arrows .left');
const arrowRight = document.querySelector('.arrows .right');

// Move the slides on arrow click:
arrowRight.addEventListener("click", () => {
    moveSlides(-galleryWidth); // move slides to the left
});

arrowLeft.addEventListener("click", () => {
    moveSlides(galleryWidth); // move slides to the right
});

// Function to move the slides:
function moveSlides(distance) {
    currentX = currentX + distance; // calc current position
    // remove classes from arrows:
    arrowRight.classList.remove('inactive');
    arrowLeft.classList.remove('inactive');
    // remove active class from current slide
    document.querySelector('.active-slide').classList.remove('active-slide');
    // prevent the slider going out of bounds
    if(currentX > 0) {
        currentX = maxGalleryWidth;
        arrowLeft.classList.add('inactive');
    }
    if(currentX < maxGalleryWidth) {
        currentX = 0;
        arrowRight.classList.add('inactive');
    }
    slideShow.style.left = `${currentX}px`; // slide!
    // set the height to the next image:
    currentSlide = -currentX/galleryWidth; // calculate current slide number
    if (currentSlide < 1) { currentSlide = 0 } // prevent slide number being a negative
    slides[currentSlide].classList.add('active-slide');
    // Set height of slideshow:
    slideshowHeight(currentSlide);
    // set dot navigation styles:
    dotNavLis.forEach(dotNavLi => dotNavLi.classList.remove('active')); // remove active classes
    dotNavLis[currentSlide].classList.add('active')
}


// --------------------------------------------------------------------------------------------------------
// DOT NAVIGATION
// --------------------------------------------------------------------------------------------------------
// Create Dot Navigation:
function createDotNav(){
    const dotNav = document.querySelector('.dot-navigation ul');
    for(let i = 0; i < numberSlides; i++){
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
    currentSlide = dotNavLi.getAttribute("data-slide"); // find current slide number
    currentX = -currentSlide * galleryWidth; // calc X position of slideshow
    slideShow.style.left = `${currentX}px`; // slide!
    // Set height of slideshow:
    slideshowHeight(currentSlide);
}));
    
})();