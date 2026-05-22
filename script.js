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
const navContent = document.querySelector('.nav-content');
const navToggle = document.querySelector('.nav-toggle');
const heroFigure = document.querySelector('.hero-figure');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncNavbarState() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.pageYOffset > 0);
}

function syncHeroFigure() {
    if (!heroFigure || motionQuery.matches) return;
    const scrollProgress = Math.min(window.pageYOffset / 520, 1);
    const bounce = Math.sin(scrollProgress * Math.PI) * 18;
    heroFigure.style.setProperty('--hero-figure-y', `${Math.round(bounce - scrollProgress * 36)}px`);
}

syncNavbarState();
syncHeroFigure();
window.addEventListener('scroll', syncNavbarState);
window.addEventListener('scroll', syncHeroFigure, { passive: true });

if (navContent && navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navContent.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navContent.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            navContent.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        });
    });
}

// ============================================================
// AI Salesperson Demo — campaign-driven scenarios
// ============================================================
//
// Each message is { from, type, text, fields?, options?, stage? }
//   from: 'user' | 'kyma' | 'system'
//   type: 'text' | 'consent' | 'flow' | 'offer' | 'system' | 'divider'
//   stage: optional integer 0..n-1 — if set, advances the stage ribbon
//          BEFORE rendering this message
// ============================================================

const scenarios = [
    // -------- 0: Guided Sales --------
    {
        title: 'Guided Sales',
        stages: ['Engage', 'Understand', 'Recommend', 'Close'],
        messages: [
            { from: 'user', type: 'text', text: "Hi, I want to understand which health cover works for my family.", stage: 0 },
            { from: 'kyma', type: 'text', text: "Happy to help! Quick question — are you looking for only yourself, or for family members too?" },
            { from: 'user', type: 'text', text: "Family floater. Two adults and one child." },
            { from: 'system', type: 'system', text: "Intent detected · insurance · family plan", stage: 1 },
            { from: 'kyma', type: 'text', text: "Got it. A family floater should work better here. I can compare the right cover, premium, and claim benefits for you. Want me to check options?", stage: 2 },
            { from: 'user', type: 'text', text: "Oh really? Yes, please." },
            { from: 'kyma', type: 'consent', text: "Quick consent — I'll use your details only to recommend eligible plans and share the policy quote." },
            { from: 'user', type: 'text', text: "[Tapped: I agree]" },
            { from: 'kyma', type: 'offer', offers: [
                { amount: '₹10L cover', rate: '₹820/mo', tenure: 'Cashless network', label: 'Recommended' },
                { amount: '₹7L cover', rate: '₹640/mo', tenure: 'Lower premium', label: 'Budget fit' }
            ]},
            { from: 'user', type: 'text', text: "I'll take the recommended one." },
            { from: 'kyma', type: 'text', text: "Done. A sales specialist will call you in the next 30 minutes to close the policy. Talk soon, Rahul.", stage: 3 }
        ]
    },

    // -------- 1: Drop-off Recovery --------
    {
        title: 'Drop-off Recovery',
        stages: ['Detect', 'Resume', 'Collect', 'Handoff'],
        messages: [
            { from: 'system', type: 'system', text: "Lead paused at eligibility details · 2 hours inactive", stage: 0 },
            { from: 'kyma', type: 'text', text: "Hi Neha, your product check is almost done. Want to finish the last two details now? It takes under a minute.", stage: 1 },
            { from: 'user', type: 'text', text: "Yes, I got stuck on income details." },
            { from: 'kyma', type: 'text', text: "No problem. Share your monthly in-hand income and employer type. I will keep the flow exactly where you left it." },
            { from: 'user', type: 'text', text: "₹68,000. Private company." },
            { from: 'kyma', type: 'flow', stage: 2, fields: ['Monthly income', 'Employer type', 'Salary account bank'] },
            { from: 'user', type: 'text', text: "[Submitted]" },
            { from: 'system', type: 'system', text: "Eligibility refreshed · product offer unlocked" },
            { from: 'kyma', type: 'offer', offers: [
                { amount: 'Premium card', rate: '5x rewards', tenure: 'Travel benefits', label: 'Best match' },
                { amount: 'Zero-fee card', rate: '2x rewards', tenure: 'No annual fee', label: 'Budget fit' }
            ]},
            { from: 'user', type: 'text', text: "First option works." },
            { from: 'kyma', type: 'text', text: "Locked. I have sent the details to the sales team. They will call in 20 minutes.", stage: 3 }
        ]
    },

    // -------- 2: Cross-sell / Upgrade --------
    {
        title: 'Cross-sell / Upgrade',
        stages: ['Recognize', 'Context', 'Offer', 'Close'],
        messages: [
            { from: 'user', type: 'text', text: "Hey, quick question about my card.", stage: 0 },
            { from: 'kyma', type: 'text', text: "Hi Priya! I see you use your card heavily for travel and dining. Looking to upgrade benefits?" },
            { from: 'user', type: 'text', text: "Yes, mainly lounge access and better rewards." },
            { from: 'system', type: 'system', text: "Eligible · premium card upgrade · pre-approved", stage: 1 },
            { from: 'kyma', type: 'text', text: "Two options that would work for you:", stage: 2 },
            { from: 'kyma', type: 'offer', offers: [
                { amount: 'Travel Plus', rate: '8 lounge visits', tenure: '5x rewards', label: 'Recommended' },
                { amount: 'Rewards Max', rate: '10x dining', tenure: 'Fuel waiver', label: 'Higher rewards' }
            ]},
            { from: 'user', type: 'text', text: "Travel Plus looks better. Let's do that." },
            { from: 'kyma', type: 'consent', text: "Re-confirm consent for the upgrade — same KYC on file, no fresh paperwork." },
            { from: 'user', type: 'text', text: "[Tapped: Confirm]" },
            { from: 'kyma', type: 'text', text: "Approved. Your upgraded card will be issued by tomorrow morning. Anything else, Priya?", stage: 3 }
        ]
    },

    // -------- 3: Completion Nudges --------
    {
        title: 'Completion Nudges',
        stages: ['Pre-approved', 'KYC', 'Consent', 'Complete'],
        messages: [
            { from: 'system', type: 'system', text: "Interested customer · KYC pending", stage: 0 },
            { from: 'kyma', type: 'text', text: "Hi Aakash, your product setup is almost done. Only KYC is pending now. Want to finish it on WhatsApp?" },
            { from: 'user', type: 'text', text: "Yes, let's do it." },
            { from: 'kyma', type: 'text', text: "Great. I will collect the basics first, then send consent for final verification.", stage: 1 },
            { from: 'kyma', type: 'flow', stage: 1, fields: ['Full name', 'Date of birth', 'Employment type', 'Monthly income', 'Pincode'] },
            { from: 'user', type: 'text', text: "[Submitted]" },
            { from: 'kyma', type: 'consent', text: "Consent to verify KYC and share your details with the sales desk for final approval?", stage: 2 },
            { from: 'user', type: 'text', text: "[Tapped: I agree]" },
            { from: 'system', type: 'system', text: "KYC complete · sale ready" },
            { from: 'kyma', type: 'text', text: "All set. Your offer is locked. A sales specialist will call within the hour to close the next step.", stage: 3 }
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
            <div class="flow-header"><i class="fab fa-whatsapp"></i> WhatsApp Flow · Details</div>
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
    const salesStackSection = document.querySelector('#sales-stack');
    const campaignsSection = document.querySelector('#campaigns');
    let sectionRevealFrame = null;

    function syncSectionReveals() {
        if (!campaignsSection) return;
        const rect = campaignsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const shouldRevealLight = rect.top <= viewportHeight * 0.38 && rect.bottom > viewportHeight * 0.24;

        if (salesStackSection) {
            salesStackSection.classList.toggle('is-light', shouldRevealLight);
        }
        campaignsSection.classList.toggle('is-light', shouldRevealLight);

        sectionRevealFrame = null;
    }

    function queueSectionRevealSync() {
        if (sectionRevealFrame !== null) return;
        sectionRevealFrame = window.requestAnimationFrame(syncSectionReveals);
    }

    syncSectionReveals();
    window.addEventListener('scroll', queueSectionRevealSync, { passive: true });
    window.addEventListener('resize', queueSectionRevealSync);
    window.addEventListener('hashchange', queueSectionRevealSync);
    window.setTimeout(queueSectionRevealSync, 0);

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
        card.style.transition = card.classList.contains('campaign-card')
            ? 'opacity 0.6s ease, transform 0.6s ease, background 0.34s ease, color 0.34s ease, box-shadow 0.34s ease'
            : 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
