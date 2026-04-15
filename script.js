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

    // Parallax Lamps
    function initLampAnimations() {
        gsap.utils.toArray('.parallax-lamp').forEach(lamp => {
            const speed = parseFloat(lamp.dataset.speed || "1");
            
            // Generate random durations and distances for a more organic, varied feel
            const randomDuration = 5.2 + Math.random() * 1.5; // Between 1.2s and 2.7s
            const randomMargin = 200 + Math.random() * 100; // Between 50px and 100px

            // 1. Fade Up Entrance Animation
            gsap.from(lamp, {
                opacity: 0,
                marginTop: randomMargin, // Fades up gracefully without conflicting with the Y parallax translation
                duration: randomDuration,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: lamp,
                    start: 'top 95%', // Starts right as the lamp is about to enter the screen
                }
            });

            // 2. Parallax Scroll Effect
            gsap.to(lamp, {
                y: 300 * speed, // Moves the element downwards as you scroll, creating a slower scroll effect
                ease: 'none',
                scrollTrigger: {
                    trigger: lamp.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // --- 3. RSVP Form Submission ---
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const guests = document.getElementById('guests').value || '0';

        // Send data to Formsubmit's AJAX endpoint
        fetch('https://formsubmit.co/ajax/andhavarapurahul@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                attendance: attendance === 'joyfully_accepts' ? 'Joyfully Accepts' : 'Regretfully Declines',
                guests: guests,
                _subject: 'New RSVP from ' + name, // Customizes the email subject line
                _captcha: 'false' // Disables the reCAPTCHA for background AJAX submissions
            })
        })
        .then(response => response.json())
        .then(data => {
            rsvpForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send RSVP';
            formMessage.innerText = 'Thank you! Your RSVP has been sent.';
            formMessage.classList.remove('hidden', 'text-red-600');
            formMessage.classList.add('text-green-600');
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        })
        .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send RSVP';
            formMessage.innerText = 'Oops! Something went wrong. Please try again.';
            formMessage.classList.remove('hidden', 'text-green-600');
            formMessage.classList.add('text-red-600');
        });
    });

    // --- 4. Background Music ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    // Sync icons automatically with the actual audio state
    bgMusic.addEventListener('play', () => {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    });

    bgMusic.addEventListener('pause', () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play error:", e));
        } else {
            bgMusic.pause();
        }
    });

    // --- 5. Welcome Overlay & Audio Unlock ---
    // The industry standard approach to bypass strict browser autoplay blocks.
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const enterBtn = document.getElementById('enter-btn');
    
    if (enterBtn && welcomeOverlay) {
        let hasEntered = false;
        
        const enterSite = () => {
            if (hasEntered) return;
            hasEntered = true;
            
            // 1. Play the music (100% guaranteed to work because it is triggered by a direct click)
            bgMusic.play().catch(e => console.log("Audio play error:", e));
            
            // 2. Fade out the overlay
            welcomeOverlay.style.opacity = '0';
            
            // Start lamp fade-up animations
            initLampAnimations();
            
            // 3. Remove overlay and restore scrolling
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
                document.body.classList.remove('overflow-hidden');
                document.body.classList.add('overflow-x-hidden');
                ScrollTrigger.refresh(); // Recalculate GSAP animations
            }, 1000);
        };

        // Allow users to click the button OR anywhere on the background overlay
        enterBtn.addEventListener('click', enterSite);
        welcomeOverlay.addEventListener('click', enterSite);
    } else {
        initLampAnimations();
    }
});
