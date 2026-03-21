const textArray = ["Juan Chavez E.", "Full Stack Developer"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeTarget = document.getElementById("typewriter");

    function type() {
        const currentText = textArray[textIndex];
         
        if (isDeleting) {
            typeTarget.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100; // Velocidad de escritura
        if (isDeleting) {
            typeSpeed /= 2; // Velocidad de borrado más rápida
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pausa al terminar de escribir la palabra
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pausa antes de escribir la siguiente palabra
        }

        setTimeout(type, typeSpeed);
    }

    // Iniciar el efecto cuando el documento cargue
    document.addEventListener("DOMContentLoaded", type);

    document.addEventListener('DOMContentLoaded', () => {
        const reveals = document.querySelectorAll('.reveal');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Dejamos de observar para que la animación no se repita al subir
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px', // Activa la animación un poco antes de llegar al fondo
            threshold: 0.15 // El 15% del elemento debe ser visible para activarse
        });

        reveals.forEach(reveal => {
            revealObserver.observe(reveal);
        });
            
        // Forzar la animación inicial para los elementos que ya están visibles al cargar la página
        setTimeout(() => {
            reveals.forEach(reveal => {
                const rect = reveal.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    reveal.classList.add('active');
                    revealObserver.unobserve(reveal);
                }
            });
        }, 100);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Quitar la clase 'active' de todos los botones y ponérsela al que se hizo clic
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // 2. FASE DE SALIDA: Aplicar fade-out a los elementos que no coinciden
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue !== 'todos' && filterValue !== itemCategory) {
                        item.classList.add('fade-out');
                    }
                });

                // 3. Esperar a que termine la animación de opacidad (400ms) antes de reordenar el layout
                setTimeout(() => {
                    projectItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        
                        if (filterValue === 'todos' || filterValue === itemCategory) {
                            // FASE DE ENTRADA: Mostrar el proyecto en el DOM
                            item.classList.remove('hide');
                            
                            // Pequeño retraso para que el navegador procese el cambio de 'hide' antes de animar
                            setTimeout(() => {
                                item.classList.remove('fade-out');
                            }, 50);
                        } else {
                            // Ahora sí, ocultar completamente el elemento del flujo de la página
                            item.classList.add('hide');
                        }
                    });
                }, 100); 
            });
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.querySelector('.skills-slider');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;
        
        let autoScrollSpeed = 0.30; 
        
        // Acumulador exacto para evitar tirones a velocidades súper lentas
        let exactScroll = 0; 

        function autoScroll() {
            if (!isDown) {
                exactScroll += autoScrollSpeed;
                slider.scrollLeft = exactScroll;
                
                // Reinicio infinito conservando decimales perfectos
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    exactScroll -= slider.scrollWidth / 2;
                    slider.scrollLeft = exactScroll;
                } else if (slider.scrollLeft <= 0) {
                    exactScroll += slider.scrollWidth / 2;
                    slider.scrollLeft = exactScroll;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        // Iniciar sincronizado
        exactScroll = slider.scrollLeft;
        autoScroll();

        slider.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationId);
        });

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(animationId);
        });

        slider.addEventListener('mouseleave', () => {
            if (!isDown) {
                exactScroll = slider.scrollLeft; // Sincronizar tras arrastrar
                autoScroll();
            } else {
                isDown = false;
                exactScroll = slider.scrollLeft;
                autoScroll();
            }
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            exactScroll = slider.scrollLeft;
            autoScroll();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;

            if (slider.scrollLeft >= slider.scrollWidth / 2) {
                slider.scrollLeft -= slider.scrollWidth / 2;
                startX = e.pageX - slider.offsetLeft; 
                scrollLeft = slider.scrollLeft;
            } else if (slider.scrollLeft <= 0) {
                slider.scrollLeft += slider.scrollWidth / 2;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            }
        });

        slider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(animationId);
        });

        slider.addEventListener('touchend', () => {
            isDown = false;
            exactScroll = slider.scrollLeft;
            autoScroll();
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;

            if (slider.scrollLeft >= slider.scrollWidth / 2) {
                slider.scrollLeft -= slider.scrollWidth / 2;
                startX = e.touches[0].pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            } else if (slider.scrollLeft <= 0) {
                slider.scrollLeft += slider.scrollWidth / 2;
                startX = e.touches[0].pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            // Deshabilitar el botón para evitar spam
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Cambiar el icono a un spinner de carga y el texto
            btnIcon.className = 'fa-solid fa-spinner fa-spin'; 
            btnText.innerText = ' Enviando...';
        });
    }
});