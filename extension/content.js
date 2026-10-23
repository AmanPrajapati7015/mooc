// 1. Hide the feedback containers initially
const feedbackContainers = document.querySelectorAll('.mt-5.flex.flex-wrap');
feedbackContainers.forEach(container => {
    container.hidden = true;
});

// 2. Select all radio inputs
const radios = document.querySelectorAll('input[type="radio"]');

radios.forEach(radio => {
    // Prevent duplicate event listeners if you click the extension icon twice
    if (radio.dataset.processed === "true") return;
    radio.dataset.processed = "true";

    // Completely remove the HTML attributes locking the correct answer
    radio.removeAttribute('disabled');
    radio.removeAttribute('checked');
    radio.checked = false;
    
    // Re-enable clicks on the label
    const parentLabel = radio.closest('label');
    if (parentLabel) {
        parentLabel.style.pointerEvents = 'auto';
    }

    radio.addEventListener('click', function (e) {
        const selectedLabel = this.closest('label').querySelector('span.break-words').textContent.trim().toLowerCase();
        const questionDiv = this.closest('section');
        
        // Disable all inputs of current question to lock in the answer
        const allRadios = questionDiv.querySelectorAll('input[type="radio"]');
        allRadios.forEach(r => r.disabled = true);

        // Find correct answer INSIDE this question only
        const feedbackContainer = questionDiv.querySelector('.mt-5.flex.flex-wrap');
        const acceptedAnswerSpan = feedbackContainer.querySelector('.ml-2'); 
        const correctAnswer = acceptedAnswerSpan ? acceptedAnswerSpan.textContent.trim().toLowerCase() : '';

        const statusBadge = feedbackContainer.children[0];

        if (selectedLabel === correctAnswer) {
            statusBadge.textContent = selectedLabel + ' (Correct Answer)';
            statusBadge.style.color = 'green';
            statusBadge.style.borderColor = 'green';
        } else {
            statusBadge.textContent = selectedLabel + ' (Wrong Answer)';
            statusBadge.style.color = 'red';
            statusBadge.style.borderColor = 'red';
        }

        // Hide the second badge so only your custom result shows
        if (feedbackContainer.children[1]) {
            feedbackContainer.children[1].hidden = true;
        }

        // Reveal the feedback container
        feedbackContainer.hidden = false;
    });
});
