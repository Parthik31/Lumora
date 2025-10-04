document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('personalized-tips-form');
        
        form.addEventListener('submit', async function(e) {
            // Prevent default form submission
            e.preventDefault();
            e.stopPropagation();
            
            // Get form values
            const systemsize = document.getElementById('system-size').value;
            const locationtips = document.getElementById('location-tips').value;
            const usagepattern = document.getElementById('usage-pattern').value;

            // Validate inputs
            if (!systemsize || !locationtips || !usagepattern) {
                alert('Please fill all fields');
                return;
            }

            // Construct the AI prompt
            const prompt = `
Act as a solar energy expert. Based on:
System Size: ${systemsize} kw
Location: ${locationtips}
Usage Pattern: ${usagepattern}

Provide 5 personalized recommendations for solar panel owners in India.
Cover these aspects:
1. Optimal usage timing
2. Maintenance best practices
3. Potential upgrades
4. Seasonal considerations
5. Financial optimization strategies

Format requirements:
- Wrap in <div class="ai-tips-results">
- Start with <h3>Your Personalized Solar Tips</h3>
- Each tip in a <div class="tip"> with <h4> for title
- Use bullet points (<ul>) for multi-part suggestions
- Include specific numbers and actionable advice
- Mention subsidies if applicable
- Keep language simple and practical
            `;

            // Show loading state
            const results = document.getElementById('results');
            const resultDetails = document.getElementById('result-details');
            resultDetails.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Generating your personalized tips...
                </div>
            `;
            results.style.display = 'block';

            try {
                // Send request to backend
                const response = await fetch('https://lumora-2-rlt9.onrender.com/generate', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ prompt })
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
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
                        <p><strong>Error:</strong> Could not generate tips.</p>
                        <p>${error.message}</p>
                        <p>Please try again later.</p>
                    </div>
                `;
            }
        });
    });


