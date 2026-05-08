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
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
});

// ============================================================
// AI Salesperson Demo — three tabbed scenarios
// ============================================================
//
// Each message is { from, type, text, fields?, options?, stage? }
//   from: 'user' | 'kyma' | 'system'
//   type: 'text' | 'consent' | 'flow' | 'offer' | 'system' | 'divider'
//   stage: optional integer 0..n-1 — if set, advances the stage ribbon
//          BEFORE rendering this message
// ============================================================

const scenarios = [
    // -------- 0: Reads intent. Upsells. --------
    {
        title: 'Reads intent. Upsells.',
        stages: ['Engage', 'Intent', 'Match', 'Consent', 'Offer', 'Close'],
        messages: [
            { from: 'user', type: 'text', text: "Hi, I need a personal loan of around ₹2L for some equipment.", stage: 0 },
            { from: 'kyma', type: 'text', text: "Happy to help! Quick question — is this for personal use or for your work?" },
            { from: 'user', type: 'text', text: "It's for my catering business, need a new oven and some kitchen stuff." },
            { from: 'system', type: 'system', text: "Intent detected · self-employed · working capital", stage: 1 },
            { from: 'kyma', type: 'text', text: "Got it. For business equipment like this, a Business Loan usually works out cheaper than a personal loan — typically 3–4% lower rate, longer tenure. Want me to check what you'd qualify for?", stage: 2 },
            { from: 'user', type: 'text', text: "Oh really? Yes, please." },
            { from: 'kyma', type: 'consent', text: "Quick consent — I'll need to verify your PAN and pull a soft credit check. No impact on your score.", stage: 3 },
            { from: 'user', type: 'text', text: "[Tapped: I agree]" },
            { from: 'kyma', type: 'offer', stage: 4, offers: [
                { amount: '₹2,50,000', rate: '14.5%', tenure: '24 mo', label: 'Recommended' },
                { amount: '₹2,00,000', rate: '13.9%', tenure: '36 mo', label: 'Lower EMI' }
            ]},
            { from: 'user', type: 'text', text: "I'll take the ₹2.5L one." },
            { from: 'kyma', type: 'text', text: "Done. A credit officer will call you in the next 30 minutes to finalize disbursal. Talk soon, Rahul.", stage: 5 }
        ]
    },

    // -------- 1: Knows your customer. Cross-sells. --------
    {
        title: 'Knows your customer. Cross-sells.',
        stages: ['Recognize', 'Context', 'Offer', 'Consent', 'Close'],
        messages: [
            { from: 'user', type: 'text', text: "Hey, quick question about my loan.", stage: 0 },
            { from: 'kyma', type: 'text', text: "Hi Priya! I see your Personal Loan PL-4421 — clean repayment history, 14 EMIs done, 10 to go. What's up?" },
            { from: 'user', type: 'text', text: "Was thinking of doing some renovation at home, need around ₹3L." },
            { from: 'system', type: 'system', text: "Eligible · Top-up loan · pre-approved", stage: 1 },
            { from: 'kyma', type: 'text', text: "Two options that would work for you:", stage: 2 },
            { from: 'kyma', type: 'offer', offers: [
                { amount: '₹3,00,000 top-up', rate: '12.9%', tenure: 'add 18 mo', label: 'Same EMI as today' },
                { amount: '₹4,50,000 BT + top-up', rate: '11.5%', tenure: '36 mo', label: 'Lower rate' }
            ]},
            { from: 'user', type: 'text', text: "The top-up looks easier. Let's do that." },
            { from: 'kyma', type: 'consent', text: "Re-confirm consent for the top-up disbursal — same KYC on file, no fresh paperwork.", stage: 3 },
            { from: 'user', type: 'text', text: "[Tapped: Confirm]" },
            { from: 'kyma', type: 'text', text: "Approved. ₹3L will hit your account by tomorrow morning. Anything else, Priya?", stage: 4 }
        ]
    },

    // -------- 2: Remembers. Recovers drop-offs. --------
    {
        title: 'Remembers. Recovers drop-offs.',
        stages: ['Engage', 'KYC paused', 'Return', 'Resume', 'Close'],
        messages: [
            { from: 'user', type: 'text', text: "Hi, looking for a ₹5L personal loan.", stage: 0 },
            { from: 'kyma', type: 'text', text: "Sure, can help. Quick PAN check first?" },
            { from: 'user', type: 'text', text: "ABCPK1234F" },
            { from: 'kyma', type: 'text', text: "Verified ✓ ABCXX1234F. Pre-approved. Just need a few KYC details." },
            { from: 'kyma', type: 'flow', stage: 1, fields: ['Full name', 'Date of birth', 'Employment type', 'Monthly income', 'Pincode'] },
            { from: 'user', type: 'text', text: "Will fill this in a bit, getting on a call." },
            { from: 'system', type: 'divider', text: "— 3 days later —", stage: 2 },
            { from: 'user', type: 'text', text: "Hey, sorry I disappeared." },
            { from: 'kyma', type: 'text', text: "No worries, Aakash 👋 Last time we were on KYC for your ₹5L pre-approval. Want to pick up there? Takes 90 seconds.", stage: 3 },
            { from: 'user', type: 'text', text: "Yes please." },
            { from: 'kyma', type: 'flow', fields: ['Full name', 'Date of birth', 'Employment type', 'Monthly income', 'Pincode'] },
            { from: 'user', type: 'text', text: "[Submitted]" },
            { from: 'kyma', type: 'text', text: "All set. Offer locked at 13.2%. Credit officer will call within the hour to release the funds.", stage: 4 }
        ]
    }
];

let activeScenario = 0;
let demoRunToken = 0; // cancels in-flight loops on tab change
let lastInteraction = Date.now();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildStageRibbon(scenarioIdx) {
    const ribbon = document.getElementById('stageRibbon');
    if (!ribbon) return;
    const stages = scenarios[scenarioIdx].stages;
    ribbon.innerHTML = '';
    stages.forEach((label) => {
        const chip = document.createElement('span');
        chip.className = 'stage pending';
        chip.textContent = label;
        ribbon.appendChild(chip);
    });
}

function setStage(stageIdx) {
    const ribbon = document.getElementById('stageRibbon');
    if (!ribbon) return;
    const chips = ribbon.querySelectorAll('.stage');
    chips.forEach((chip, i) => {
        chip.classList.remove('pending', 'active', 'done');
        if (i < stageIdx) chip.classList.add('done');
        else if (i === stageIdx) chip.classList.add('active');
        else chip.classList.add('pending');
    });
}

function makeBubble(message) {
    const wrap = document.createElement('div');
    wrap.className = `chat-message ${message.from}`;

    if (message.type === 'divider') {
        const div = document.createElement('div');
        div.className = 'chat-divider';
        div.textContent = message.text;
        wrap.className = 'chat-divider-row';
        wrap.appendChild(div);
        return wrap;
    }

    if (message.type === 'system') {
        const sys = document.createElement('div');
        sys.className = 'system-bubble';
        sys.innerHTML = `<i class="fas fa-circle-info"></i> ${message.text}`;
        wrap.className = 'chat-message system';
        wrap.appendChild(sys);
        return wrap;
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (message.type === 'text') {
        bubble.textContent = message.text;
    } else if (message.type === 'consent') {
        bubble.classList.add('consent-bubble');
        bubble.innerHTML = `
            <div class="consent-text">${message.text}</div>
            <div class="consent-actions">
                <span class="consent-btn primary">I agree</span>
                <span class="consent-btn">Read T&Cs</span>
            </div>
        `;
    } else if (message.type === 'flow') {
        bubble.classList.add('flow-card');
        const fieldsHtml = message.fields.map(f =>
            `<div class="flow-field"><span class="flow-label">${f}</span><span class="flow-input">______</span></div>`
        ).join('');
        bubble.innerHTML = `
            <div class="flow-header"><i class="fab fa-whatsapp"></i> WhatsApp Flow · KYC</div>
            ${fieldsHtml}
            <div class="flow-submit">Submit</div>
        `;
    } else if (message.type === 'offer') {
        bubble.classList.add('offer-card');
        const offersHtml = message.offers.map(o => `
            <div class="offer-row">
                <div class="offer-main">
                    <div class="offer-amount">${o.amount}</div>
                    <div class="offer-meta">${o.rate} · ${o.tenure}</div>
                </div>
                <div class="offer-tag">${o.label}</div>
            </div>
        `).join('');
        bubble.innerHTML = `
            <div class="offer-header"><i class="fas fa-list-check"></i> Offers for you</div>
            ${offersHtml}
        `;
    }

    wrap.appendChild(bubble);
    return wrap;
}

function makeTypingBubble() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-message kyma';
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typing.appendChild(dot);
    }
    wrap.appendChild(typing);
    return wrap;
}

async function playScenario(scenarioIdx, runToken) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const scenario = scenarios[scenarioIdx];
    container.innerHTML = '';
    buildStageRibbon(scenarioIdx);
    setStage(0);

    await sleep(600);
    if (runToken !== demoRunToken) return;

    for (const message of scenario.messages) {
        if (runToken !== demoRunToken) return;

        if (typeof message.stage === 'number') {
            setStage(message.stage);
        }

        // Typing indicator for kyma replies (not for system / divider / user)
        if (message.from === 'kyma') {
            const typing = makeTypingBubble();
            container.appendChild(typing);
            container.scrollTop = container.scrollHeight;
            await sleep(1100);
            if (runToken !== demoRunToken) return;
            typing.remove();
        }

        const bubble = makeBubble(message);
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;

        let delay = 1100;
        if (message.from === 'user') delay = 900;
        if (message.type === 'system' || message.type === 'divider') delay = 1200;
        if (message.type === 'flow' || message.type === 'offer' || message.type === 'consent') delay = 1500;
        await sleep(delay);
    }

    // Mark all stages done after the last message
    setStage(scenario.stages.length);

    // Hold on the final frame
    await sleep(3500);
    if (runToken !== demoRunToken) return;

    // Auto-cycle to the next scenario if the user hasn't interacted in a while
    const idleMs = Date.now() - lastInteraction;
    if (idleMs > 8000) {
        const nextIdx = (scenarioIdx + 1) % scenarios.length;
        switchScenario(nextIdx, /*userInitiated*/ false);
    } else {
        // Otherwise just loop the same one
        playScenario(scenarioIdx, runToken);
    }
}

function switchScenario(idx, userInitiated) {
    activeScenario = idx;
    if (userInitiated) lastInteraction = Date.now();

    // Update tab UI
    document.querySelectorAll('.demo-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === idx);
    });

    // Cancel current run, start new one
    demoRunToken += 1;
    playScenario(idx, demoRunToken);
}

// Wire up tabs + start
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.demo-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.dataset.scenario, 10);
            if (!Number.isNaN(idx)) switchScenario(idx, true);
        });
    });

    switchScenario(0, false);

    // Card scroll-in animation
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
    const cards = document.querySelectorAll('.pillar-card, .team-member, .step');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
