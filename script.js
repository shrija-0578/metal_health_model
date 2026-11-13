document.getElementById('prediction-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Map input fields to match StudentData model in FastAPI
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
        stress_level: document.getElementById('stress_level').value
    };

    const resultBox = document.getElementById('result-container');
    const placeholderText = document.querySelector('.placeholder-text');
    const scoreDisplay = document.getElementById('score-display');
    const scoreValueElem = document.getElementById('score-value');
    const scoreCategoryElem = document.getElementById('score-category');

    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve prediction.');
        }

        const result = await response.json();
        const score = result.predicted_mental_health_score;

        // Display score
        placeholderText.classList.add('hidden');
        scoreDisplay.classList.remove('hidden');
        scoreValueElem.textContent = score;

        // Clear previous color states
        resultBox.classList.remove('green', 'orange', 'yellow', 'red', 'neutral');

        // Color coding logic based on score thresholds (adjust range boundaries as per your target metric)
        let category = '';
        let colorClass = '';

        if (score >= 7.5) {
            category = 'Good';
            colorClass = 'green';
        } else if (score >= 5.0) {
            category = 'Average';
            colorClass = 'orange';
        } else if (score >= 2.5) {
            category = 'Below Average';
            colorClass = 'yellow';
        } else {
            category = 'Poor';
            colorClass = 'red';
        }

        scoreCategoryElem.textContent = `Status: ${category}`;
        resultBox.classList.add(colorClass);

    } catch (error) {
        console.error('Error connecting to API:', error);
        alert('Could not connect to the backend server. Ensure FastAPI is running at http://localhost:8000');
    }
});