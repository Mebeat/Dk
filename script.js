document.addEventListener('DOMContentLoaded', function() {
    const charactersWrapper = document.querySelector('.characters-wrapper');
    const charactersContainer = document.querySelector('.characters');
    const characterBoxes = document.querySelectorAll('.character');
    let currentCharacterIndex = 0;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let clickPrevented = false;
    let touchStartX;
    let touchStartTime;

    // Preload profile images
    const profileImages = [];
    characterBoxes.forEach((box) => {
        const profileSrc = box.dataset.profile;
        if (profileSrc) {
            const img = new Image();
            img.src = profileSrc;
            profileImages.push(img);
        }
    });

    // Function to show full profile image on click
    function showFullProfile(profileSrc) {
        const fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "flex";
        fullImageOverlay.style.backgroundImage = "url('" + profileSrc + "')";
        document.body.style.overflow = "hidden";

        // Show pixel sprites based on the current profile index
        const leftPixelSrc = characterBoxes[currentCharacterIndex].dataset.leftPixel;
        const rightPixelSrc = characterBoxes[currentCharacterIndex].dataset.rightPixel;

        if (leftPixelSrc) {
            document.getElementById("leftPixelSprite").style.backgroundImage = "url('" + leftPixelSrc + "')";
            document.getElementById("leftPixelSprite").style.opacity = "1";
        }
        
        if (rightPixelSrc) {
            document.getElementById("rightPixelSprite").style.backgroundImage = "url('" + rightPixelSrc + "')";
            document.getElementById("rightPixelSprite").style.opacity = "1";
        }
    }

    // Function to hide full profile image overlay
    window.hideFullImage = function() {
        const fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "none";
        document.body.style.overflow = "auto";

        // Hide pixel sprites
        document.getElementById("leftPixelSprite").style.opacity = "0";
        document.getElementById("rightPixelSprite").style.opacity = "0";
    };

    // Function to start dragging on mouse down
    function dragStart(e) {
        if (e.type === 'touchstart') {
            touchStartX = e.touches[0].pageX;
            touchStartTime = new Date().getTime();
            startX = touchStartX;
        } else {
            startX = e.pageX;
        }
        
        isDragging = true;
        scrollLeft = charactersWrapper.scrollLeft;
        clickPrevented = false;
        
        if (e.type !== 'touchstart') {
            e.preventDefault();
        }
    }

    // Function to end dragging on mouse up or touch end
    function dragEnd(e) {
        isDragging = false;
        
        // For touch events, check if it was a tap or swipe
        if (e.type === 'touchend') {
            const touchEndTime = new Date().getTime();
            const touchEndX = e.changedTouches[0].pageX;
            const timeDiff = touchEndTime - touchStartTime;
            const distanceMoved = Math.abs(touchEndX - touchStartX);
            
            // If it was a quick tap with minimal movement, count it as a click
            if (timeDiff < 250 && distanceMoved < 10) {
                clickPrevented = false;
            } else {
                clickPrevented = true;
                setTimeout(() => { clickPrevented = false; }, 100);
            }
        } else {
            setTimeout(() => { clickPrevented = false; }, 100);
        }
    }

    // Function to perform dragging on mouse move or touch move
    function dragMove(e) {
        if (!isDragging) return;
        
        let x;
        if (e.type === 'touchmove') {
            x = e.touches[0].pageX;
            // Prevent screen from scrolling when swiping characters
            e.preventDefault();
        } else {
            x = e.pageX;
        }
        
        const walk = (x - startX) * 1.5; // Adjust this multiplier to change scroll speed
        charactersWrapper.scrollLeft = scrollLeft - walk;
        
        if (Math.abs(walk) > 5) {
            clickPrevented = true;
        }
    }

    // Add event listeners for both mouse and touch events
    charactersWrapper.addEventListener('mousedown', dragStart);
    charactersWrapper.addEventListener('touchstart', dragStart, { passive: false });
    
    charactersWrapper.addEventListener('mouseup', dragEnd);
    charactersWrapper.addEventListener('touchend', dragEnd);
    
    charactersWrapper.addEventListener('mousemove', dragMove);
    charactersWrapper.addEventListener('touchmove', dragMove, { passive: false });
    
    charactersWrapper.addEventListener('mouseleave', dragEnd);

    // Add click event listeners to character boxes
    characterBoxes.forEach((box, index) => {
        box.addEventListener('click', (e) => {
            if (!clickPrevented) {
                currentCharacterIndex = index;
                const characterProfile = box.dataset.profile;
                if (characterProfile) {
                    showFullProfile(characterProfile);
                }
            }
        });

        // Prevent right-click menu
        box.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });

    // Function to show the next character
    function showNextCharacter() {
        currentCharacterIndex = (currentCharacterIndex + 1) % characterBoxes.length;
        const characterProfile = characterBoxes[currentCharacterIndex].dataset.profile;
        if (characterProfile) {
            showFullProfile(characterProfile);
        }
    }

    // Function to show the previous character
    function showPreviousCharacter() {
        currentCharacterIndex = (currentCharacterIndex - 1 + characterBoxes.length) % characterBoxes.length;
        const characterProfile = characterBoxes[currentCharacterIndex].dataset.profile;
        if (characterProfile) {
            showFullProfile(characterProfile);
        }
    }

    // Add click event listeners to the navigation buttons
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    if (leftButton && rightButton) {
        leftButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to overlay
            showPreviousCharacter();
        });
        
        rightButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to overlay
            showNextCharacter();
        });
    }

    // Add keydown event listener for arrow keys
    document.addEventListener('keydown', (e) => {
        if (document.getElementById("fullImageOverlay").style.display === "flex") {
            if (e.key === 'ArrowLeft') {
                showPreviousCharacter();
            } else if (e.key === 'ArrowRight') {
                showNextCharacter();
            } else if (e.key === 'Escape') {
                hideFullImage();
            }
        }
    });

    // Handle swipe gestures on fullImageOverlay for mobile
    let touchStartXOverlay;
    let touchEndXOverlay;
    
    document.getElementById("fullImageOverlay").addEventListener('touchstart', function(e) {
        touchStartXOverlay = e.touches[0].clientX;
    }, { passive: true });
    
    document.getElementById("fullImageOverlay").addEventListener('touchend', function(e) {
        touchEndXOverlay = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (!touchStartXOverlay || !touchEndXOverlay) return;
        
        const swipeDistance = touchEndXOverlay - touchStartXOverlay;
        const minSwipeDistance = 50; // Minimum distance required for a swipe
        
        if (swipeDistance > minSwipeDistance) {
            // Swiped right, show previous character
            showPreviousCharacter();
        } else if (swipeDistance < -minSwipeDistance) {
            // Swiped left, show next character
            showNextCharacter();
        }
    }
    
    // Resize handling
    function handleResize() {
        // Adjust character sizes or other responsive elements if needed
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        // Any specific adjustments can be made here
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on load
});
