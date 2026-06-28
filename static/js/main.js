// EFECTO TYPEWRITER
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

    let typeSpeed = 100;
    if (isDeleting) {
        typeSpeed /= 2;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pausa al terminar
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500; // Pausa antes de la siguiente palabra
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", type);


// ANIMACIONES CON SCROLL REVEAL
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
        
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


// FILTRADO DE PROYECTOS
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                // Usamos includes por si un proyecto tiene múltiples categorías (ej. "web corporativo")
                if (filterValue !== 'todos' && !itemCategory.includes(filterValue)) {
                    item.classList.add('fade-out');
                }
            });

            setTimeout(() => {
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'todos' || itemCategory.includes(filterValue)) {
                        item.classList.remove('hide');
                        
                        setTimeout(() => {
                            item.classList.remove('fade-out');
                        }, 50);
                    } else {
                        item.classList.add('hide');
                    }
                });
            }, 100); 
        });
    });
});


// INFINITE SKILLS SLIDER
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.skills-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let animationId;
    let autoScrollSpeed = 1.30; 
    let exactScroll = 0; 

    function autoScroll() {
        if (!isDown) {
            exactScroll += autoScrollSpeed;
            slider.scrollLeft = exactScroll;
            
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

    exactScroll = slider.scrollLeft;
    autoScroll();

    slider.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        cancelAnimationFrame(animationId);
    });

    slider.addEventListener('mouseleave', () => {
        if (!isDown) {
            exactScroll = slider.scrollLeft;
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


// FORMULARIO DE CONTACTO
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    window.location.href = '/gracias.html';
                } else {
                    alert("Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.");
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                alert("Error de conexión. Verifica tu red y vuelve a intentarlo.");
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                submitBtn.innerHTML = originalText;
            }
        });
    }
});


// INTERCAMBIO DE CAPTURAS PROJECT
window.changeImage = function(imageId, newSrc, thumbnailElement) {
    const mainImage = document.getElementById(imageId);
    if (!mainImage) return;
    
    mainImage.style.opacity = '0.5';
    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
    }, 150);

    const galleryContainer = thumbnailElement.closest('.thumbnail-gallery');
    if (galleryContainer) {
        const allThumbnails = galleryContainer.querySelectorAll('.thumbnail-item');
        allThumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnailElement.classList.add('active');
    }
};