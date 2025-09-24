document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const nextButton = document.querySelector('.next-slide');
    const prevButton = document.querySelector('.prev-slide');
    let currentIndex = 0;
    let autoSlideInterval;
    const slideTransitionDuration = 700; // Match CSS transition duration for .slider-track

    function showSlide(index) {
        if (!sliderTrack || slides.length === 0) { // Verificar si sliderTrack o slides están vacíos
            console.warn("Image slider elements not found or no slides available.");
            return;
        }

        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        }

        // 1. Remove active class from all cards immediately
        slides.forEach(slide => {
            const card = slide.querySelector('.card-overlay');
            if (card) card.classList.remove('active'); // Verificar si card existe
        });

        sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;

        // 2. Add active class to the current card AFTER the slide transition
        setTimeout(() => {
            const currentCard = slides[currentIndex].querySelector('.card-overlay');
            if (currentCard) currentCard.classList.add('active'); // Verificar si currentCard existe
        }, slideTransitionDuration); // Delay matches slider-track transition
    }

    function nextSlide() {
        try {
            currentIndex++;
            showSlide(currentIndex);
        } catch (error) {
            console.error("Error in nextSlide (Image Slider):", error);
            stopAutoSlide(); // Detener el auto-slide si hay un error
        }
    }

    function prevSlide() {
        try {
            currentIndex--;
            showSlide(currentIndex);
        } catch (error) {
            console.error("Error in prevSlide (Image Slider):", error);
            stopAutoSlide(); // Detener el auto-slide si hay un error
        }
    }

    function startAutoSlide() {
        if (slides.length > 1) { // Solo iniciar auto-slide si hay más de una tarjeta
            autoSlideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event Listeners
    if (nextButton) { // Verificar si el botón existe
        nextButton.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevButton) { // Verificar si el botón existe
        prevButton.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) { // Verificar si imageSlider existe
        imageSlider.addEventListener('mouseenter', stopAutoSlide);
        imageSlider.addEventListener('mouseleave', startAutoSlide);
    }

    // Inicializar slider
    showSlide(currentIndex);
    startAutoSlide();

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // If another item is open, close it.
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            // Toggle the clicked item.
            item.classList.toggle('active');
        });
    });

    // Animación de partículas para la sección del equipo
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Ajustar tamaño del canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Clase para las partículas
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Crear partículas
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                let color = 'rgba(0, 0, 0, 0.1)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Conectar partículas
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0, 0, 0, ' + opacityValue + ')';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Bucle de animación
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Redimensionar al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            init();
        });

        init();
        animate();
    }

    // --- Animación de Scroll para Elementos --- 
    const animatedElements = document.querySelectorAll('.feature-item, .testimonial-card');
    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }

    // --- Contador con Animación de Palpitación ---
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // Función para activar la palpitación
        const palpitate = (element) => {
            if (!element) return;
            const block = element.parentElement;
            block.classList.add('palpitate-now');
            setTimeout(() => {
                block.classList.remove('palpitate-now');
            }, 400); // Duración de la animación en CSS es 0.4s
        };

        const raffleEndDate = new Date();
        raffleEndDate.setDate(raffleEndDate.getDate() + 30);

        function updateCountdown() {
            const now = new Date();
            const diff = raffleEndDate - now;

            if (diff <= 0) {
                countdownElement.innerHTML = "<h2>¡El sorteo ha finalizado!</h2>";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Actualizar texto
            if(daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if(hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if(minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if(secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');

            // Lógica de animación
            palpitate(secondsEl);

            if (seconds === 59) {
                palpitate(minutesEl);
            }
            if (minutes === 59 && seconds === 59) {
                palpitate(hoursEl);
            }
            if (hours === 23 && minutes === 59 && seconds === 59) {
                palpitate(daysEl);
            }
        }

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Llamada inicial
    }
});
