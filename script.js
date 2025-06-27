document.addEventListener('DOMContentLoaded', () => {
    // Elementos da tela de seleção de linguagem
    const languageSelectionScreen = document.getElementById('language-selection');
    const langButtons = document.querySelectorAll('.lang-btn');

    // Elementos do quiz
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const submitButton = document.getElementById('submit-button'); // Novo botão de verificar
    const nextButton = document.getElementById('next-button');     // Botão de próxima pergunta
    const explanationContainer = document.getElementById('explanation-container'); // Contêiner da explicação
    const explanationText = document.getElementById('explanation-text'); // Texto da explicação
    const resultContainer = document.getElementById('result-container');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const restartButton = document.getElementById('restart-button');
    const backToMenuButton = document.getElementById('back-to-menu-button');
    const currentQNumSpan = document.getElementById('current-q-num');
    const totalQNumSpan = document.getElementById('total-q-num');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let currentLanguage = '';

    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentLanguage = event.target.dataset.lang;
            quizTitle.textContent = `Quiz de Conhecimento em ${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`;
            startLoadingQuiz();
        });
    });

    async function fetchQuestions(language) {
        try {
            const response = await fetch(`quizzes/${language}.json`);
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o quiz de ${language}.json`);
            }
            const data = await response.json();
            // Acessa o array de perguntas dentro do objeto 'questions'
            questions = data.questions; 
            shuffleArray(questions);
            startQuiz();
        } catch (error) {
            console.error('Erro ao buscar perguntas:', error);
            questionElement.textContent = `Falha ao carregar as perguntas do quiz de ${language}. Por favor, tente novamente.`;
            quizContainer.style.display = 'none';
            languageSelectionScreen.style.display = 'block';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startLoadingQuiz() {
        languageSelectionScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        fetchQuestions(currentLanguage);
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultContainer.style.display = 'none';
        nextButton.style.display = 'none'; // Garante que o botão "Próxima" esteja oculto no início
        submitButton.style.display = 'none'; // Oculta o botão de submit até uma opção ser selecionada
        explanationContainer.style.display = 'none'; // Oculta a explicação no início
        totalQNumSpan.textContent = questions.length;
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsContainer.innerHTML = '';
            selectedOption = null;
            submitButton.style.display = 'none'; // Oculta o botão de submit ao carregar uma nova pergunta
            explanationContainer.style.display = 'none'; // Oculta a explicação ao carregar uma nova pergunta
            nextButton.style.display = 'none'; // Oculta o botão de próxima pergunta

            currentQNumSpan.textContent = currentQuestionIndex + 1;

            const shuffledOptions = [...currentQuestion.options];
            shuffleArray(shuffledOptions);

            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => {
                    // Remove 'selected' class from previously selected option
                    if (selectedOption) {
                        selectedOption.classList.remove('selected');
                    }
                    button.classList.add('selected');
                    selectedOption = button;
                    submitButton.style.display = 'block'; // Mostra o botão de submit ao selecionar uma opção
                });
                optionsContainer.appendChild(button);
            });
        } else {
            showResult();
        }
    }

    // Event listener para o novo botão "Verificar Resposta"
    submitButton.addEventListener('click', () => {
        if (selectedOption) { // Somente prossiga se uma opção for selecionada
            const currentQuestion = questions[currentQuestionIndex];
            const userAnswer = selectedOption.textContent;

            // Aplica o estilo de correto/incorreto a todas as opções
            Array.from(optionsContainer.children).forEach(button => {
                button.disabled = true; // Desabilita todos os botões após uma resposta ser selecionada
                if (button.textContent === currentQuestion.answer) {
                    button.classList.add('correct');
                } else if (button.classList.contains('selected')) {
                    button.classList.add('incorrect');
                }
            });

            // Verifica a resposta e atualiza a pontuação
            if (userAnswer === currentQuestion.answer) {
                score++;
            }

            // Exibe a explicação
            explanationText.textContent = currentQuestion.explanation;
            explanationContainer.style.display = 'block';

            // Oculta o botão "Verificar Resposta" e mostra "Próxima Pergunta"
            submitButton.style.display = 'none';
            nextButton.style.display = 'block';
        }
    });

    // Event listener para o botão "Próxima Pergunta"
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    function showResult() {
        questionElement.textContent = '';
        optionsContainer.innerHTML = '';
        submitButton.style.display = 'none';
        nextButton.style.display = 'none';
        explanationContainer.style.display = 'none'; // Esconde a explicação no resultado final
        resultContainer.style.display = 'block';
        scoreSpan.textContent = score;
        totalQuestionsSpan.textContent = questions.length;
        currentQNumSpan.textContent = questions.length;
    }

    // Reinicia o quiz com a mesma linguagem
    restartButton.addEventListener('click', startQuiz);

    // Volta para a tela de seleção de linguagem
    backToMenuButton.addEventListener('click', () => {
        quizContainer.style.display = 'none';
        languageSelectionScreen.style.display = 'block';
    });

    // Ao carregar a página, a tela de seleção de linguagem já está visível por padrão via HTML.
});