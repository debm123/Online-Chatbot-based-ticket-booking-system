document.addEventListener('DOMContentLoaded', (event) => {
    // Get references to buttons and chat log
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const chatLog = document.getElementById('chat-log');
    const enBtn = document.getElementById('en-btn');
    const hiBtn = document.getElementById('hi-btn');
    const bnBtn = document.getElementById('bn-btn');

    let recognition; // Variable for speech recognition
    let currentStep = 0; // Tracks the current step in the conversation
    let language = 'en-US'; // Default language set to English
    let userData = { // Object to store user data
        name: '',
        phone: '',
        bookingOpinion: '',
        showName: '',
        showPrice: 0,
        ticketCount: '',
        totalPrice: ''
    };

    // Array of shows with prices
    const shows = [
        { name: 'SHOW 1', price: 100 },
        { name: 'SHOW 2', price: 150 },
        { name: 'SHOW 3', price: 200 }
    ];

    // Steps for conversation based on language
    const steps = {
        'en-US': [
            "Welcome! I'm a Museum Chatbot! What's your name?",
            "Please tell us your phone number.",
            "Would you like to book a ticket?",
            `Here are the available shows:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">Show</th>
                    <th style="text-align: left;">Price</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} rupees</td>
                </tr>
                `).join('')}
            </table>
            <br>Which show would you like to book? (Please provide the number)`,
            "How many tickets would you like to book?",
            "Do you want to proceed with the payment?"
        ],
        'hi-IN': [
            "स्वागत है! मैं एक म्यूज़ियम चैटबोट हूँ! आपका नाम क्या है?",
            "कृपया हमें अपना फोन नंबर बताएं।",
            "क्या आप टिकट बुक करना चाहेंगे?",
            `यहाँ उपलब्ध शो हैं:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">शो</th>
                    <th style="text-align: left;">कीमत</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} रुपये</td>
                </tr>
                `).join('')}
            </table>
            <br>आप कौन सा शो बुक करना चाहेंगे? (कृपया संख्या प्रदान करें)`,
            "आप कितने टिकट बुक करना चाहेंगे?",
            "क्या आप भुगतान जारी रखना चाहते हैं?"
        ],
        'bn-BD': [ // Bengali language steps
            "স্বাগতম! আমি একটি যাদুঘরের চ্যাটবট! আপনার নাম কি?",
            "দয়া করে আপনার ফোন নম্বর বলুন।",
            "আপনি কি একটি টিকিট বুক করতে চান?",
            `এখানে উপলব্ধ শোগুলি:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">শো</th>
                    <th style="text-align: left;">মূল্য</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} টাকা</td>
                </tr>
                `).join('')}
            </table>
            <br>আপনি কোন শো বুক করতে চান? (দয়া করে সংখ্যা প্রদান করুন)`,
            "আপনি কতগুলি টিকিট বুক করতে চান?",
            "আপনি কি পেমেন্ট করতে চান?"
        ]
    };

    // Function to handle moving to the next step
    const nextStep = () => {
        if (currentStep < steps[language].length) {
            chatLog.innerHTML += `<div><strong>Bot:</strong> ${steps[language][currentStep]}</div>`;
            currentStep++;
        } else {
            // Final confirmation message
            chatLog.innerHTML += `<div><strong>Bot:</strong> Thank you, ${userData.name}. You have booked ${userData.ticketCount} tickets for ${userData.showName}. Your phone number is ${userData.phone}. Your ticket is being processed!</div>`;
            recognition.stop(); // Stop recognition at the end
            return;
        }
    };

    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition(); // For Chrome
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition(); // For other browsers
    } else {
        alert('Your browser does not support speech recognition.'); // Alert if not supported
    }

    if (recognition) {
        recognition.continuous = true; // Keep recognizing continuously
        recognition.interimResults = false; // No interim results

        // Event when recognition starts
        recognition.onstart = () => {
            startBtn.disabled = true; // Disable start button
            stopBtn.disabled = false; // Enable stop button
        };

        // Event when recognition ends
        recognition.onend = () => {
            startBtn.disabled = false; // Enable start button
            stopBtn.disabled = true; // Disable stop button
        };

        // Event for when speech recognition results are available
        recognition.onresult = (event) => {
            let finalTranscript = ''; // Variable to hold the final transcript

            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript; // Get the transcript
                if (event.results[i].isFinal) { // Check if the result is final
                    finalTranscript = transcript;
                }
            }

            if (finalTranscript) {
                chatLog.innerHTML += `<div><strong>User:</strong> ${finalTranscript}</div>`; // Log user input
                finalTranscript = finalTranscript.trim(); // Trim whitespace

                // Handle different conversation steps
                switch (currentStep) {
                    case 1: // Name input
                        userData.name = finalTranscript;
                        break;
                    case 2: // Phone number input
                        userData.phone = finalTranscript;
                        break;
                    case 3: // Booking opinion
                        userData.bookingOpinion = finalTranscript.toLowerCase();
                        if (userData.bookingOpinion === 'no') {
                            chatLog.innerHTML += `<div><strong>Bot:</strong> Okay, have a nice day!</div>`;
                            recognition.stop(); // Stop if user doesn't want to book
                            return;
                        }
                        break;
                    case 4: // Show selection
                        const showIndex = parseInt(finalTranscript) - 1; // Get show index
                        if (!isNaN(showIndex) && showIndex >= 0 && showIndex < shows.length) {
                            userData.showName = shows[showIndex].name; // Store show name
                            userData.showPrice = shows[showIndex].price; // Store show price
                        } else {
                            chatLog.innerHTML += `<div><strong>Bot:</strong> Invalid show number. Please try again.</div>`;
                            currentStep--; // Stay on the same step
                            return;
                        }
                        break;
                    case 5: // Ticket count input
                        userData.ticketCount = parseInt(finalTranscript);
                        if (isNaN(userData.ticketCount) || userData.ticketCount <= 0) {
                            chatLog.innerHTML += `<div><strong>Bot:</strong> Invalid ticket count. Please try again.</div>`;
                            currentStep--; // Stay on the same step
                            return;
                        }
                        userData.totalPrice = userData.showPrice * userData.ticketCount; // Calculate total price
                        chatLog.innerHTML += `<div><strong>Bot:</strong> The total price for ${userData.ticketCount} tickets to ${userData.showName} is ${userData.totalPrice} rupees. Do you want to proceed with the payment?</div>`;
                        
                        // Create payment button
                        const paymentBtn = document.createElement('button');
                        paymentBtn.innerText = "Proceed to Payment";
                        paymentBtn.id = "payment-btn";
                        chatLog.appendChild(paymentBtn);
                    
                        paymentBtn.addEventListener('click', () => {
                            window.location.href = 'pay.html'; // Redirect to payment page
                        });

                        recognition.stop(); // Stop recognition for the last step
                        startBtn.disabled = true; // Disable start button
                        stopBtn.disabled = true; // Disable stop button
                        return;
                }

                if (currentStep !== -1) {
                    nextStep(); // Move to the next step
                }
            }
        };

        // Start button event listener
        startBtn.addEventListener('click', () => {
            currentStep = 0; // Reset to the initial step
            nextStep(); // Show the first bot message
            recognition.lang = language; // Set recognition language
            recognition.start(); // Start speech recognition
        });

        // Stop button event listener
        stopBtn.addEventListener('click', () => {
            recognition.stop(); // Stop speech recognition
        });

        // Language selection button event listeners
        enBtn.addEventListener('click', () => {
            language = 'en-US'; // Set language to English
            chatLog.innerHTML += `<div><strong>Bot:</strong> You have selected English.</div>`;
        });

        hiBtn.addEventListener('click', () => {
            language = 'hi-IN'; // Set language to Hindi
            chatLog.innerHTML += `<div><strong>Bot:</strong> आपने हिंदी चुनी है।</div>`;
        });

        bnBtn.addEventListener('click', () => {
            language = 'bn-BD'; // Set language to Bengali
            chatLog.innerHTML += `<div><strong>Bot:</strong> আপনি বাংলা নির্বাচন করেছেন।</div>`;
        });
    }
});























