document.addEventListener('DOMContentLoaded', () => {
    // Elementos da tela de seleção de linguagem
    const languageSelectionScreen = document.getElementById('language-selection');
    const langButtons = document.querySelectorAll('.lang-btn');

    // Elementos do quiz
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
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
    let currentLanguage = ''; // Para armazenar a linguagem selecionada

    // Adiciona event listeners para os botões de seleção de linguagem
    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentLanguage = event.target.dataset.lang; // Pega o valor do atributo data-lang
            quizTitle.textContent = `Quiz de Conhecimento em ${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`; // Atualiza o título do quiz
            startLoadingQuiz();
        });
    });

    // Função para buscar perguntas do arquivo JSON da linguagem selecionada
    async function fetchQuestions(language) {
        try {
            const response = await fetch(`quizzes/${language}.json`);
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o quiz de ${language}.json`);
            }
            questions = await response.json();
            // Embaralha as perguntas para que apareçam em ordem diferente a cada vez
            shuffleArray(questions);
            startQuiz();
        } catch (error) {
            console.error('Erro ao buscar perguntas:', error);
            questionElement.textContent = `Falha ao carregar as perguntas do quiz de ${language}. Por favor, tente novamente.`;
            quizContainer.style.display = 'none';
            languageSelectionScreen.style.display = 'block'; // Volta para a seleção de linguagem
        }
    }

    // Função para embaralhar um array (algoritmo Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Inicia o processo de carregamento do quiz
    function startLoadingQuiz() {
        languageSelectionScreen.style.display = 'none'; // Esconde a tela de seleção
        quizContainer.style.display = 'block'; // Mostra o contêiner do quiz
        fetchQuestions(currentLanguage); // Carrega as perguntas da linguagem selecionada
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultContainer.style.display = 'none';
        nextButton.style.display = 'block';
        totalQNumSpan.textContent = questions.length; // Define o total de perguntas
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsContainer.innerHTML = ''; // Limpa opções anteriores
            selectedOption = null; // Reseta a opção selecionada

            // Atualiza o número da pergunta atual
            currentQNumSpan.textContent = currentQuestionIndex + 1;

            // Embaralha as opções para cada pergunta
            const shuffledOptions = [...currentQuestion.options];
            shuffleArray(shuffledOptions);

            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => selectOption(button));
                optionsContainer.appendChild(button);
            });
            nextButton.textContent = 'Próxima Pergunta';
            nextButton.disabled = true; // Desabilita o botão "Próxima" até que uma opção seja selecionada
        } else {
            showResult();
        }
    }

    function selectOption(button) {
        // Remove a classe 'selected' da opção previamente selecionada
        if (selectedOption) {
            selectedOption.classList.remove('selected');
        }
        // Adiciona a classe 'selected' à nova opção selecionada
        button.classList.add('selected');
        selectedOption = button; // Atualiza selectedOption

        // Habilita o botão "Próxima" uma vez que uma opção é selecionada
        nextButton.disabled = false;
    }

    nextButton.addEventListener('click', () => {
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

            // Move para a próxima pergunta após um pequeno atraso para mostrar o feedback
            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1000); // 1 segundo de atraso
        }
    });

    function showResult() {
        questionElement.textContent = '';
        optionsContainer.innerHTML = '';
        nextButton.style.display = 'none';
        resultContainer.style.display = 'block';
        scoreSpan.textContent = score;
        totalQuestionsSpan.textContent = questions.length;
        currentQNumSpan.textContent = questions.length; // Garante que o progresso mostre o total
    }

    // Reinicia o quiz com a mesma linguagem
    restartButton.addEventListener('click', startQuiz);

    // Volta para a tela de seleção de linguagem
    backToMenuButton.addEventListener('click', () => {
        quizContainer.style.display = 'none';
        languageSelectionScreen.style.display = 'block';
    });

    // Ao carregar a página, a tela de seleção de linguagem já está visível por padrão via HTML.
    // Nenhuma chamada inicial a fetchQuestions() é necessária aqui.
});