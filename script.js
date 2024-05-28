document.addEventListener('DOMContentLoaded', function() {
    const charactersWrapper = document.querySelector('.characters-wrapper');
    const characterBoxes = document.querySelectorAll('.character');
    let currentCharacterIndex = 0;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let clickPrevented = false;

    // Function to show full profile image on click
    function showFullProfile(profileSrc) {
        const fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "flex";
        fullImageOverlay.style.backgroundImage = "url('" + profileSrc + "')";
        document.body.style.overflow = "hidden";
        updateNavButtons();
    }

    // Function to hide full profile image overlay
    function hideFullProfile() {
        const fullImageOverlay = document.getElementById("fullImageOverlay");
        fullImageOverlay.style.display = "none";
        document.body.style.overflow = "auto";
    }

    // Function to start dragging on mouse down
    function dragStart(e) {
        isDragging = true;
        startX = e.pageX;
        scrollLeft = charactersWrapper.scrollLeft;
        clickPrevented = false;
        e.preventDefault();
    }

    // Function to end dragging on mouse up
    function dragEnd() {
        isDragging = false;
        setTimeout(() => { clickPrevented = false; }, 100);
    }

    // Function to perform dragging on mouse move
    function dragMove(e) {
        if (isDragging) {
            const x = e.pageX;
            const walk = (x - startX) * 1; // Adjust this multiplier to change scroll speed
            charactersWrapper.scrollLeft = scrollLeft - walk;
            clickPrevented = true;
        }
    }

    // Add event listeners to character boxes for dragging behavior
    charactersWrapper.addEventListener('mousedown', dragStart);
    charactersWrapper.addEventListener('mouseleave', dragEnd);
    charactersWrapper.addEventListener('mouseup', dragEnd);
    charactersWrapper.addEventListener('mousemove', dragMove);

    // Add click event listeners to character boxes
    characterBoxes.forEach((box, index) => {
        box.addEventListener('click', (e) => {
            if (!clickPrevented) {
                currentCharacterIndex = index;
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

    // Function to show the next character
    function showNextCharacter() {
        currentCharacterIndex = (currentCharacterIndex + 1) % characterBoxes.length;
        const characterProfile = characterBoxes[currentCharacterIndex].dataset.profile;
        showFullProfile(characterProfile);
    }

    // Function to show the previous character
    function showPreviousCharacter() {
        currentCharacterIndex = (currentCharacterIndex - 1 + characterBoxes.length) % characterBoxes.length;
        const characterProfile = characterBoxes[currentCharacterIndex].dataset.profile;
        showFullProfile(characterProfile);
    }

    // Function to update navigation button images
    function updateNavButtons() {
        const prevCharacterIndex = (currentCharacterIndex - 1 + characterBoxes.length) % characterBoxes.length;
        const nextCharacterIndex = (currentCharacterIndex + 1) % characterBoxes.length;
        document.getElementById('leftButtonImg').src = `pixel${prevCharacterIndex + 1}.png`;
        document.getElementById('rightButtonImg').src = `pixel${nextCharacterIndex + 1}.png`;
    }

    // Add click event listeners to the navigation buttons
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    leftButton.addEventListener('click', showPreviousCharacter);
    rightButton.addEventListener('click', showNextCharacter);

    // Add keydown event listener for arrow keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPreviousCharacter();
        } else if (e.key === 'ArrowRight') {
            showNextCharacter();
        }
    });
});
