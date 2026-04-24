const headers = document.querySelectorAll('.feedback-header');
headers.forEach(head => {
    head.hidden = true;
});


const Faculty_Labels = document.querySelectorAll('.faculty-answer label');
Faculty_Labels.forEach(label => {
    label.hidden = true;
});



const radios = document.querySelectorAll('input[type="radio"]');

radios.forEach(radio => {
    radio.disabled = false;
    radio.checked = false;
    radio.addEventListener('change', function () {

        // 1. Get clicked label
        const selectedLabel = document.querySelector(`label[for="${this.id}"]`)
            .textContent.trim();

        // 2. Go to parent question container
        const questionDiv = this.closest('.qt-mc-question');
        //disabled all inputs of current option
        const allRadios = questionDiv.querySelectorAll('input[type="radio"]');
        allRadios.forEach(r => r.disabled = true);

        // 3. Find correct answer INSIDE this question only
        const faculty_answer = questionDiv.querySelector('.faculty-answer label');

        const correctAnswer = faculty_answer.textContent.trim();

        console.log("Selected:", selectedLabel);
        console.log("Correct:", correctAnswer);

        if (selectedLabel === correctAnswer) {
            console.log("✅ Correct!");
            faculty_answer.textContent += ' (Correct Answer)';
            faculty_answer.style.color = 'green';

        } else {
            console.log("❌ Wrong!");
            faculty_answer.textContent += ' (Wrong Answer)';
            faculty_answer.style.color = 'red';
        }

        faculty_answer.hidden = false;
    });
});