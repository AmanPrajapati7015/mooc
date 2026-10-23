let correctCount = 0;
let wrongCount = 0;

function initTracker(totalQuestions) {
    if (document.getElementById('quiz-progress-tracker')) return;

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
            Quiz Progress: <span id="qc-answered">0</span> / <span id="qc-total">${totalQuestions}</span>
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

function updateProgress(totalQuestions) {
    const answeredTotal = correctCount + wrongCount;
    document.getElementById('qc-answered').innerText = answeredTotal;
    document.getElementById('qc-correct').innerText = correctCount;
    document.getElementById('qc-wrong').innerText = wrongCount;

    const correctPct = (correctCount / totalQuestions) * 100;
    const wrongPct = (wrongCount / totalQuestions) * 100;

    document.getElementById('qc-bar-correct').style.width = correctPct + '%';
    document.getElementById('qc-bar-wrong').style.width = wrongPct + '%';
}

function processQuestions() {
    const allQuestions = document.querySelectorAll('section.bg-white');
    if (allQuestions.length === 0) return;

    initTracker(allQuestions.length);

    allQuestions.forEach(questionDiv => {
        if (questionDiv.dataset.processed === "true") return;
        questionDiv.dataset.processed = "true";

        const feedbackContainer = questionDiv.querySelector('.mt-5.flex.flex-wrap');
        if (feedbackContainer) feedbackContainer.hidden = true;

        const radios = questionDiv.querySelectorAll('input[type="radio"]');

        radios.forEach(radio => {
            radio.removeAttribute('disabled');
            radio.removeAttribute('checked');
            radio.checked = false;

            const parentLabel = radio.closest('label');
            if (parentLabel) parentLabel.style.pointerEvents = 'auto';

            radio.addEventListener('click', function () {
                const selectedLabel = this.closest('label').querySelector('span.break-words').textContent.trim().toLowerCase();

                const allRadios = questionDiv.querySelectorAll('input[type="radio"]');
                allRadios.forEach(r => r.disabled = true);

                let correctAnswer = '';
                if (feedbackContainer) {
                    // Check both spans and divs to be safe
                    const elements = feedbackContainer.querySelectorAll('span, div');
                    for (let el of elements) {
                        // Use exact match to avoid matching a parent container that holds the whole sentence
                        if (el.textContent.trim() === 'Accepted answer is') {
                            const siblingElement = el.nextElementSibling;
                            if (siblingElement) {
                                correctAnswer = siblingElement.textContent.trim().toLowerCase();
                            }
                            break;
                        }
                    }
                }

                const statusBadge = feedbackContainer.children[0];

                if (selectedLabel === correctAnswer) {
                    statusBadge.textContent = selectedLabel + ' (Correct Answer)';
                    statusBadge.style.color = '#1C9B38';
                    statusBadge.style.borderColor = '#1C9B38';
                    correctCount++;
                } else {
                    statusBadge.textContent = selectedLabel + ' (Wrong Answer)';
                    statusBadge.style.color = '#dc3545';
                    statusBadge.style.borderColor = '#dc3545';
                    wrongCount++;
                }

                updateProgress(allQuestions.length);

                if (feedbackContainer.children[1]) {
                    feedbackContainer.children[1].hidden = true;
                }
                feedbackContainer.hidden = false;
            });
        });
    });
}

let checkInterval = setInterval(() => {
    if (document.querySelectorAll('section.bg-white').length > 0) {
        processQuestions();
        clearInterval(checkInterval);
    }
}, 500);