# Quiz de Programação

Este é um projeto de um quiz interativo desenvolvido com HTML, CSS e JavaScript puro. Ele permite aos usuários testar seus conhecimentos em diferentes linguagens de programação, com feedback imediato e explicações detalhadas para cada resposta.

## Funcionalidades

* **Seleção de Linguagem**: Escolha entre diferentes linguagens de programação (Python e JavaScript por enquanto).
* **Perguntas Aleatórias**: As perguntas e opções são embaralhadas a cada rodada.
* **Verificação Manual**: O usuário responde à pergunta e clica em "Verificar Resposta" para ver o feedback e a explicação.
* **Explicações Detalhadas**: Cada pergunta correta ou incorreta é acompanhada por uma explicação para facilitar o aprendizado.
* **Navegação Manual**: Um botão "Próxima Pergunta" permite ao usuário avançar no quiz após revisar a resposta.
* **Controle de Progresso**: Acompanhe o número da pergunta atual e o total de perguntas.
* **Pontuação Final**: Veja sua pontuação ao final do quiz.
* **Opções de Reinício**: Reinicie o quiz na mesma linguagem ou volte ao menu principal.

## Como Usar

1.  **Clone o Repositório**:
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```

2.  **Abra o `index.html`**:
    Simplesmente abra o arquivo `index.html` em seu navegador web preferido.

3.  **Hospedagem (Opcional)**:
    Você pode hospedar este quiz facilmente usando o GitHub Pages. Basta fazer o push do seu código para um repositório no GitHub e configurar o GitHub Pages nas configurações do repositório para servir a partir do branch `main` (ou `master`).

## Estrutura do Projeto

├── index.html          # Estrutura principal da página
├── style.css           # Estilos para o quiz
├── script.js           # Lógica JavaScript do quiz
├── README.md           # Este arquivo
└── quizzes/            # Pasta contendo os arquivos JSON com as perguntas
├── python.json     # Perguntas para o quiz de Python
└── javascript.json # Perguntas para o quiz de JavaScript

## Personalização

* **Adicionar Mais Perguntas**:
    Para adicionar mais perguntas, edite os arquivos JSON dentro da pasta `quizzes/`. Siga o formato existente, incluindo `question`, `options`, `answer` e `explanation`.

    ```json
    {
      "questions": [
        {
          "question": "Sua nova pergunta aqui?",
          "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
          "answer": "Resposta Correta",
          "explanation": "Explicação detalhada da resposta."
        }
      ]
    }
    ```

* **Adicionar Novas Linguagens (Quizzes)**:
    1.  Crie um novo arquivo JSON dentro da pasta `quizzes/` (ex: `csharp.json`).
    2.  Adicione as perguntas e respostas neste novo arquivo JSON, seguindo o mesmo formato dos outros arquivos.
    3.  No `index.html`, adicione um novo botão de linguagem na seção `<div class="language-options">`, apontando para o seu novo arquivo:
        ```html
        <button class="lang-btn" data-lang="csharp">C#</button>
        ```
        (Substitua `csharp` pelo nome da sua linguagem).

* **Modificar Estilos**:
    Edite o arquivo `style.css` para alterar as cores, fontes, layouts, etc., conforme suas preferências.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. (Se você não tem um arquivo LICENSE, pode remover esta seção ou criar um.)