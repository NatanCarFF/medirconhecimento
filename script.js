document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultContainer = document.getElementById('result-container');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const restartButton = document.getElementById('restart-button');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null; // To keep track of the currently selected option

    // Fetch questions from JSON file
    async function fetchQuestions() {
        try {
            const response = await fetch('questions.json');
            questions = await response.json();
            startQuiz();
        } catch (error) {
            console.error('Error fetching questions:', error);
            questionElement.textContent = 'Failed to load quiz questions.';
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultContainer.style.display = 'none';
        nextButton.style.display = 'block';
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsContainer.innerHTML = ''; // Clear previous options
            selectedOption = null; // Reset selected option

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => selectOption(button, option, currentQuestion.answer));
                optionsContainer.appendChild(button);
            });
            nextButton.textContent = 'Next Question'; // Reset button text
            nextButton.disabled = true; // Disable next button until an option is selected
        } else {
            showResult();
        }
    }

    function selectOption(button, selectedAnswer, correctAnswer) {
        // Remove 'selected' class from previously selected option
        if (selectedOption) {
            selectedOption.classList.remove('selected');
        }
        // Add 'selected' class to the new selected option
        button.classList.add('selected');
        selectedOption = button; // Update selectedOption

        // Enable the next button once an option is selected
        nextButton.disabled = false;
    }

    nextButton.addEventListener('click', () => {
        if (selectedOption) { // Only proceed if an option is selected
            const currentQuestion = questions[currentQuestionIndex];
            const userAnswer = selectedOption.textContent;

            // Apply correct/incorrect styling to all options
            Array.from(optionsContainer.children).forEach(button => {
                button.disabled = true; // Disable all buttons after an answer is selected
                if (button.textContent === currentQuestion.answer) {
                    button.classList.add('correct');
                } else if (button.classList.contains('selected')) {
                    button.classList.add('incorrect');
                }
            });

            // Check answer and update score
            if (userAnswer === currentQuestion.answer) {
                score++;
            }

            // Move to next question after a short delay to show feedback
            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1000); // 1-second delay
        }
    });

    function showResult() {
        questionElement.textContent = '';
        optionsContainer.innerHTML = '';
        nextButton.style.display = 'none';
        resultContainer.style.display = 'block';
        scoreSpan.textContent = score;
        totalQuestionsSpan.textContent = questions.length;
    }

    restartButton.addEventListener('click', startQuiz);

    // Initial fetch of questions when the page loads
    fetchQuestions();
});