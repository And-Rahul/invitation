// script.js - Interactive elements and animations

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    
    // Set wedding date from the HTML data attribute, or fallback to Aug 26, 2026
    const weddingDate = new Date(countdownElement.dataset.date || '2026-08-26T00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "<span>Happily Married!</span>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="flex flex-col items-center">
                <span class="font-bold">${days}</span>
                <span class="text-xs uppercase tracking-widest text-gold-400 mt-1">Days</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="font-bold">${hours.toString().padStart(2, '0')}</span>
                <span class="text-xs uppercase tracking-widest text-gold-400 mt-1">Hrs</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="font-bold">${minutes.toString().padStart(2, '0')}</span>
                <span class="text-xs uppercase tracking-widest text-gold-400 mt-1">Min</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="font-bold">${seconds.toString().padStart(2, '0')}</span>
                <span class="text-xs uppercase tracking-widest text-gold-400 mt-1">Sec</span>
            </div>
        `;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 2. GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero content fade up
    gsap.from('.hero-content', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2
    });

    // Story Section
    gsap.from('.story-content', {
        scrollTrigger: {
            trigger: '#story',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // Events Stagger
    gsap.from('.event-card', {
        scrollTrigger: {
            trigger: '#events',
            start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });

    // Venue Section
    gsap.from('.venue-content', {
        scrollTrigger: {
            trigger: '#venue',
            start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // RSVP Form
    gsap.from('.rsvp-content', {
        scrollTrigger: {
            trigger: '#rsvp',
            start: 'top 80%',
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // --- 3. RSVP Form Submission ---
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real scenario, this would send an API request (e.g., to Formspree or Google Sheets)
        // For now, we simulate success
        
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        setTimeout(() => {
            rsvpForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send RSVP';
            formMessage.classList.remove('hidden');
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }, 1500);
    });
});
