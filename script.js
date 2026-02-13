// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }

    lastScroll = currentScroll;
});

// Chat Animation
const chatMessages = [
    { type: 'user', text: "Hi! I want to plan a trip to Europe for our anniversary. Can you help?" },
    { type: 'kyma', text: "Absolutely! Based on your preferences, I'd recommend 5 nights in Santorini followed by 3 nights in Paris. I can book flights using your reward points and arrange luxury accommodations." },
    { type: 'user', text: "That sounds perfect. Can you book it using my reward points?" },
    { type: 'kyma', text: "Done! I've booked your flights and hotels using 45,000 points. You're staying at the Katikies Hotel in Santorini and Le Meurice in Paris. I'll check you in 24 hours before departure and arrange a room decoration for your anniversary." },
    { type: 'user', text: "Amazing. This is why I love this card." }
];

let chatAnimationInterval;
let isFirstPlay = true;

function createMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    return messageDiv;
}

function createTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message kyma';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
    }

    messageDiv.appendChild(typingDiv);
    return messageDiv;
}

async function animateChat() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    // Clear existing messages
    chatContainer.innerHTML = '';

    // Add initial delay on first play
    if (isFirstPlay) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        isFirstPlay = false;
    }

    for (let i = 0; i < chatMessages.length; i++) {
        const message = chatMessages[i];

        // Show typing indicator for Kyma messages
        if (message.type === 'kyma') {
            const typingIndicator = createTypingIndicator();
            chatContainer.appendChild(typingIndicator);

            // Wait for typing animation
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Remove typing indicator
            typingIndicator.remove();
        }

        // Add the actual message
        const messageElement = createMessage(message.type, message.text);
        chatContainer.appendChild(messageElement);

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Wait before next message (shorter for user messages, longer for Kyma responses)
        const delay = message.type === 'user' ? 1200 : 1500;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Wait at the end before restarting
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Restart animation
    animateChat();
}

// Start chat animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    animateChat();

    // Add animation on scroll for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards with updated selectors
    const cards = document.querySelectorAll('.problem-card, .use-case-card, .comparison-card, .differentiator-card, .team-member, .step');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
