document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Configuración Inicial y Elementos del DOM
       ========================================================================== */
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = musicBtn.querySelector('i');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    let isPlaying = false;

    /* ==========================================================================
       2. Partículas (Usando particles.js)
       ========================================================================== */
    const particlesConfig = {
        "particles": {
            "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#e8c5d0", "#d4af37", "#ffffff"] },
            "shape": { 
                "type": "circle",
                "stroke": { "width": 0, "color": "#000000" },
                "polygon": { "nb_sides": 5 }
            },
            "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 5, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true },
            "modes": { "bubble": { "distance": 200, "size": 6, "duration": 2, "opacity": 0.8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 } }
        },
        "retina_detect": true
    };

    // Inicializar partículas en ambas secciones
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js-welcome', particlesConfig);
        particlesJS('particles-js-hero', particlesConfig);
    }

    /* ==========================================================================
       3. Pantalla de Bienvenida y Música
       ========================================================================== */
    openBtn.addEventListener('click', () => {
        // Animación de salida
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            musicBtn.classList.remove('hidden');
            
            // Intentar reproducir música
            playMusic();
            
            // Refrescar AOS o ScrollReveal si se usaran librerías, pero aquí usamos IntersectionObserver
            initScrollReveal();
        }, 1000);
    });

    function playMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
        }).catch(err => {
            console.log("Autoplay bloqueado por el navegador, el usuario debe interactuar.");
            isPlaying = false;
        });
    }

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-volume-up');
            musicIcon.classList.add('fa-volume-mute');
        } else {
            bgMusic.play();
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
        }
        isPlaying = !isPlaying;
    });

    /* ==========================================================================
       4. Scroll Reveal (Aparición suave al hacer scroll)
       ========================================================================== */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.section-reveal');
        
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    /* ==========================================================================
       5. Cuenta Regresiva
       ========================================================================== */
    // Fecha del evento: 20 de Septiembre a las 00:00 horas
    const eventDate = new Date(2026, 8, 20, 0, 0, 0).getTime(); // Mes 8 = Septiembre

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance <= 0) {
            document.querySelector('.countdown-container').innerHTML = "<h3 style='font-size: 2.5rem; color: var(--color-rosa-oscuro); text-align: center; width: 100%;'>¡Hoy es el día!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ==========================================================================
       6. Botón Volver Arriba
       ========================================================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================================
       7. Formulario RSVP (Confirmación de Asistencia) a Google Sheets
       ========================================================================== */
    const rsvpForm = document.getElementById('rsvp-form');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const attendanceInput = document.getElementById('attendance');
    const formMessage = document.getElementById('form-message');

    // REEMPLAZAR ESTA URL POR LA URL DEL WEB APP DE GOOGLE APPS SCRIPT
    const scriptURL = 'AQUI_LA_URL_DE_TU_WEB_APP';

    function setAttendance(value, activeBtn, inactiveBtn) {
        attendanceInput.value = value;
        activeBtn.style.transform = 'scale(0.95)';
        setTimeout(() => activeBtn.style.transform = 'scale(1)', 150);
        
        // Simular envío para UX rápida
        submitForm();
    }

    btnYes.addEventListener('click', () => setAttendance('Sí', btnYes, btnNo));
    btnNo.addEventListener('click', () => setAttendance('No', btnNo, btnYes));

    function submitForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const attendance = attendanceInput.value;

        if (!fullName) {
            showMessage('Por favor, ingresa tu nombre completo.', 'error');
            return;
        }

        // Deshabilitar botones
        btnYes.disabled = true;
        btnNo.disabled = true;
        showMessage('Enviando respuesta...', 'success');

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('attendance', attendance);

        // Fetch API a Google Apps Script
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                showMessage('¡Gracias por responder! Tu confirmación ha sido guardada.', 'success');
                if (attendance === 'Sí') {
                    lanzarConfeti();
                }
                // Limpiar formulario y dejar deshabilitado
                rsvpForm.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                showMessage('Hubo un error al enviar. Por favor, intenta de nuevo o contáctame.', 'error');
                btnYes.disabled = false;
                btnNo.disabled = false;
            });
    }

    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = '';
        formMessage.classList.add(type === 'error' ? 'msg-error' : 'msg-success');
        formMessage.classList.remove('hidden');
    }

    /* ==========================================================================
       8. Efecto de Confeti (canvas-confetti)
       ========================================================================== */
    function lanzarConfeti() {
        var duration = 3000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    /* ==========================================================================
       9. Botones Extra (Compartir)
       ========================================================================== */
    document.getElementById('share-whatsapp').addEventListener('click', () => {
        const text = encodeURIComponent("¡Estás invitado a mis XV Años! Mira mi invitación digital aquí: " + window.location.href);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    document.getElementById('copy-link').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('¡Enlace copiado al portapapeles!');
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    });

});
