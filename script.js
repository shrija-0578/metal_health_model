// Handle stress level pill selection
const pillButtons = document.querySelectorAll('.pill-btn');
const stressLevelInput = document.getElementById('stress_level');

pillButtons.forEach(button => {
    button.addEventListener('click', () => {
        pillButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        stressLevelInput.value = button.getAttribute('data-value');
    });
});

// Handle form submission and view state switching
const form = document.getElementById('prediction-form');
const initialState = document.getElementById('initial-state');
const loadingState = document.getElementById('loading-state');
const successState = document.getElementById('success-state');
const scoreValueElem = document.getElementById('score-value');
const signalStrengthElem = document.getElementById('signal-strength');
const resetBtn = document.getElementById('reset-btn');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Switch to loading state
    initialState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    successState.classList.add('hidden');

    const payload = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value,
        academic_level: document.getElementById('academic_level').value,
        most_used_platform: document.getElementById('most_used_platform').value,
        purpose_of_use: document.getElementById('purpose_of_use').value,
        avg_daily_usage_hours: parseFloat(document.getElementById('avg_daily_usage_hours').value),
        daily_unlocks: parseInt(document.getElementById('daily_unlocks').value),
        study_hours: parseFloat(document.getElementById('study_hours').value),
        physical_activity_hours: parseFloat(document.getElementById('physical_activity_hours').value),
        sleep_hours_per_night: parseFloat(document.getElementById('sleep_hours_per_night').value),
        stress_level: stressLevelInput.value
    };

    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Prediction API failed');
        }

        const result = await response.json();
        const score = Number(result.predicted_mental_health_score).toFixed(2);

        setTimeout(() => {
            loadingState.classList.add('hidden');
            successState.classList.remove('hidden');
            scoreValueElem.textContent = score;

            // Clear previous color classes from the score value
            scoreValueElem.classList.remove('score-green', 'score-orange', 'score-yellow', 'score-red');

            // Apply color coding and category message based on thresholds
            if (score >= 7.5) {
                signalStrengthElem.textContent = "Good";
                scoreValueElem.classList.add('score-green');
            } else if (score >= 5.5) {
                signalStrengthElem.textContent = "Average";
                scoreValueElem.classList.add('score-orange');
            } else if (score >= 3.5) {
                signalStrengthElem.textContent = "Below Average";
                scoreValueElem.classList.add('score-yellow');
            } else {
                signalStrengthElem.textContent = "Poor";
                scoreValueElem.classList.add('score-red');
            }
        }, 600);

    } catch (error) {
        console.error('Backend connection error:', error);
        alert('Could not connect to FastAPI server at http://localhost:8000. Make sure uvicorn is running.');
        loadingState.classList.add('hidden');
        initialState.classList.remove('hidden');
    }
});

// Reset view on "Run another read" click
resetBtn.addEventListener('click', () => {
    successState.classList.add('hidden');
    initialState.classList.remove('hidden');
});