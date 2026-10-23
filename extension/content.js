// 1. Setup the Score Trackers
let correctCount = 0;
let wrongCount = 0;
const allQuestions = document.querySelectorAll('section.bg-white');
const totalQuestions = allQuestions.length;

// 2. Create the floating progress UI (ensure we only create it once)
if (!document.getElementById('quiz-progress-tracker')) {
    const tracker = document.createElement('div');
    tracker.id = 'quiz-progress-tracker';
    tracker.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        background: white; 
        border: 1px solid #e5e7eb; 
        padding: 15px; 
        border-radius: 8px; 
        z-index: 999999; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        width: 250px; 
        font-family: sans-serif;
    `;
    
    tracker.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px; font-size: 14px; color: #333;">
            Quiz Progress: <span id="qc-answered">0</span> / ${totalQuestions}
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; font-weight: 500;">
            <span style="color: #1C9B38;">Correct: <span id="qc-correct">0</span></span>
            <span style="color: #dc3545;">Wrong: <span id="qc-wrong">0</span></span>
        </div>
        <div style="width: 100%; background: #f3f4f6; height: 8px; border-radius: 4px; overflow: hidden; display: flex;">
            <div id="qc-bar-correct" style="height: 100%; background: #1C9B38; width: 0%; transition: width 0.3s ease;"></div>
            <div id="qc-bar-wrong" style="height: 100%; background: #dc3545; width: 0%; transition: width 0.3s ease;"></div>
        </div>
    `;
    document.body.appendChild(tracker);
}

// Function to update the tracker UI
function updateProgress() {
    const answeredTotal = correctCount + wrongCount;
    document.getElementById('qc-answered').innerText = answeredTotal;
    document.getElementById('qc-correct').innerText = correctCount;
    document.getElementById('qc-wrong').innerText = wrongCount;
    
    const correctPct = (correctCount / totalQuestions) * 100;
    const wrongPct = (wrongCount / totalQuestions) * 100;
    
    document.getElementById('qc-bar-correct').style.width = correctPct + '%';
    document.getElementById('qc-bar-wrong').style.width = wrongPct + '%';
}


// 3. Hide the feedback containers initially
const feedbackContainers = document.querySelectorAll('.mt-5.flex.flex-wrap');
feedbackContainers.forEach(container => {
    container.hidden = true;
});

// 4. Select all radio inputs and apply quiz logic
const radios = document.querySelectorAll('input[type="radio"]');

radios.forEach(radio => {
    if (radio.dataset.processed === "true") return;
    radio.dataset.processed = "true";

    radio.removeAttribute('disabled');
    radio.removeAttribute('checked');
    radio.checked = false;
    
    const parentLabel = radio.closest('label');
    if (parentLabel) {
        parentLabel.style.pointerEvents = 'auto';
    }

    radio.addEventListener('click', function (e) {
        const selectedLabel = this.closest('label').querySelector('span.break-words').textContent.trim().toLowerCase();
        const questionDiv = this.closest('section');
        
        // Lock the question
        const allRadios = questionDiv.querySelectorAll('input[type="radio"]');
        allRadios.forEach(r => r.disabled = true);

        // Find correct answer
        const feedbackContainer = questionDiv.querySelector('.mt-5.flex.flex-wrap');
        const acceptedAnswerSpan = feedbackContainer.querySelector('.ml-2'); 
        const correctAnswer = acceptedAnswerSpan ? acceptedAnswerSpan.textContent.trim().toLowerCase() : '';

        const statusBadge = feedbackContainer.children[0];

        // Evaluate and update score
        if (selectedLabel === correctAnswer) {
            statusBadge.textContent = selectedLabel + ' (Correct Answer)';
            statusBadge.style.color = '#1C9B38';
            statusBadge.style.borderColor = '#1C9B38';
            correctCount++; // Increment correct score
        } else {
            statusBadge.textContent = selectedLabel + ' (Wrong Answer)';
            statusBadge.style.color = '#dc3545';
            statusBadge.style.borderColor = '#dc3545';
            wrongCount++; // Increment wrong score
        }

        // Update the visual progress bar
        updateProgress();

        if (feedbackContainer.children[1]) {
            feedbackContainer.children[1].hidden = true;
        }

        feedbackContainer.hidden = false;
    });
});
