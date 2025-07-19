document.getElementById('solar-calculator').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const location = document.getElementById('location').value;
    const bill = document.getElementById('bill').value;
    const rooftop = document.getElementById('rooftop').value;
    const budget = document.getElementById('budget').value;

    // Construct the AI prompt
    const prompt = `
Act as a solar energy expert. Based on:
Location: ${location}
Monthly Electricity Bill: ₹${bill}
Available Rooftop Area: ${rooftop} sq ft
Installation Budget: ₹${budget}

Provide detailed estimates in HTML format with the following information:
1. Recommended solar system size (in kW)
2. Estimated monthly savings (in ₹)
3. Projected payback period (in years)
4. Available subsidies and incentives
5. Estimated CO2 reduction per year (in tons)

Format the response with proper HTML tags for good readability. Include headings for each section and use bullet points where appropriate.
    `;

    // Show loading state
    const results = document.getElementById('results');
    const resultDetails = document.getElementById('result-details');
    resultDetails.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> Calculating with AI...</div>`;
    results.style.display = 'block';

    try {
        // Send request to backend
        const response = await fetch('https://lumora-a34t.onrender.com/generate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Display the AI response
        resultDetails.innerHTML = data.result;
    } catch (error) {
        console.error('Error:', error);
        resultDetails.innerHTML = `
            <div class="error">
                <p><strong>Error:</strong> Could not fetch results.</p>
                <p>${error.message}</p>
                <p>Please try again later or check your connection.</p>
            </div>
        `;
    }
});
