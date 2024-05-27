document.addEventListener('DOMContentLoaded', function() {
    const charactersWrapper = document.querySelector('.characters-wrapper');
    let isDragging = false;
    let startX;
    let scrollLeft;
    let hasMoved = false; // Flag to track if mouse has moved during dragging
    const clickThreshold = 5; // Adjust this value as needed

    // Function to start dragging on mouse down
    function dragStart(e) {
        isDragging = true;
        startX = e.pageX;
        scrollLeft = charactersWrapper.scrollLeft;
        hasMoved = false; // Reset the flag
        e.preventDefault();
    }

    // Function to end dragging on mouse up
    function dragEnd() {
        isDragging = false;
        // Check if mouse has moved during dragging, if not, prevent the click
        if (!hasMoved) {
            e.preventDefault();
        }
    }

    // Function to perform dragging on mouse move
    function dragMove(e) {
        if (isDragging) {
            const x = e.pageX;
            const walk = (x - startX) * 1; // Adjust the multiplier to make dragging slower
            charactersWrapper.scrollLeft = scrollLeft - walk;
            hasMoved = true; // Set the flag to true indicating mouse movement
        }
    }

    // Add event listeners to character boxes for dragging behavior
    charactersWrapper.addEventListener('mousedown', dragStart);
    charactersWrapper.addEventListener('mouseleave', dragEnd);
    charactersWrapper.addEventListener('mouseup', dragEnd);
    charactersWrapper.addEventListener('mousemove', dragMove);

    // Function to show full profile image on click
    function showFullProfile(profileSrc) {
        var fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "flex"; // Show the full image overlay
        fullImageOverlay.style.backgroundImage = "url('" + profileSrc + "')"; // Set the background image
        document.body.style.overflow = "hidden"; // Prevent scrolling on the main page
    }

    // Function to hide full profile image overlay
    function hideFullProfile() {
        var fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "none"; // Hide the full image overlay
        document.body.style.overflow = "auto"; // Restore scrolling on the main page
    }

    // Add click event listeners to character boxes
    const characterBoxes = document.querySelectorAll('.character');
    characterBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            // Check if it's a left mouse button click and if mouse has not moved much during dragging
            if (e.button === 0 && !hasMoved) {
                const characterProfile = box.dataset.profile;
                showFullProfile(characterProfile);
            }
        });

        // Prevent right-click menu
        box.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });

    // Add click event listener to the close button
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', hideFullProfile);
});
