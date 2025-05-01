document.addEventListener('DOMContentLoaded', function() {
    const questions = [
        "What is your personality type? (e.g., adventurous, relaxed, curious)",
        "How many days are you staying?",
        "What holiday activities do you enjoy? (e.g., museums, adventure sports, relaxation, culinary experiences, shopping)",
        "What is your preferred pace of travel? (e.g., fast-paced, moderate, leisurely)"
    ];
    
    let currentQuestion = 0;
    const answers = {};
    
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const nextButton = document.getElementById('next-button');
    const questionnaireDiv = document.getElementById('questionnaire');
    const resultDiv = document.getElementById('result');
    const itineraryOutput = document.getElementById('itinerary-output');
    const restartButton = document.getElementById('restart-button');
    
    function showQuestion() {
        if (currentQuestion < questions.length) {
            questionText.textContent = questions[currentQuestion];
            answerInput.value = "";
        }
    }
    
    nextButton.addEventListener('click', function() {
        const answer = answerInput.value.trim();
        if (answer === "") return;
        
        switch(currentQuestion) {
            case 0:
                answers.personality = answer;
                break;
            case 1:
                answers.days = answer;
                break;
            case 2:
                answers.habits = answer;
                break;
            case 3:
                answers.pace = answer;
                break;
        }
        
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            // Smooth transition effect between questions.
            questionText.style.opacity = 0;
            setTimeout(() => {
                showQuestion();
                questionText.style.opacity = 1;
            }, 500);
        } else {
            // When all questions are answered, hide the questionnaire and generate the itinerary.
            questionnaireDiv.classList.add('d-none');
            generateItinerary();
        }
    });
    
    restartButton.addEventListener('click', function() {
        currentQuestion = 0;
        Object.keys(answers).forEach(key => delete answers[key]);
        resultDiv.classList.add('d-none');
        questionnaireDiv.classList.remove('d-none');
        showQuestion();
    });
    
    async function generateItinerary() {
        itineraryOutput.textContent = "Generating your personalized itinerary, please wait...";
        try {
            const response = await fetch('/generate_itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answers)
            });
            const data = await response.json();
            itineraryOutput.textContent = data.itinerary;
        } catch (error) {
            itineraryOutput.textContent = "Error generating itinerary.";
            console.error("Error:", error);
        }
        resultDiv.classList.remove('d-none');
    }
    
    // Start the questionnaire.
    showQuestion();
});
