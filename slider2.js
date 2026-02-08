
const cards2 = document.querySelectorAll('.card2');
const nextBtn2 = document.querySelector('.next2');
const prevBtn2 = document.querySelector('.prev2');
const dots2 = document.querySelectorAll('.dot2');

let startOffset2 = 2; 

function updateSlider2(direction2) {
    if (direction2 === 'next' && startOffset2 < cards2.length - 1) {
        startOffset2++;
    } else if (direction2 === 'prev' && startOffset2 > 0) {
        startOffset2--;
    }

    cards2.forEach((card2, index2) => {
        const relI2 = index2 - startOffset2;
        const dist2 = Math.abs(relI2);

        card2.style.setProperty('--i2', relI2);
        card2.style.setProperty('--dist2', dist2);
        
        const isActive2 = relI2 === 0;
        card2.classList.toggle('active2', isActive2);
    });

    if (dots2.length > 0) {
        dots2.forEach((dot2, index2) => {
            dot2.classList.toggle('active2', index2 === startOffset2);
        });
    }

    checkButtons2();
}

function checkButtons2() {
    if(prevBtn2) prevBtn2.disabled = (startOffset2 === 0);
    if(nextBtn2) nextBtn2.disabled = (startOffset2 === cards2.length - 1);
}

nextBtn2.addEventListener('click', () => updateSlider2('next'));
prevBtn2.addEventListener('click', () => updateSlider2('prev'));

dots2.forEach((dot2, index2) => {
    dot2.addEventListener('click', () => {
        startOffset2 = index2;
        updateSlider2();
    });
});

window.addEventListener('DOMContentLoaded', () => {
    updateSlider2();
});

// Variable am Anfang deines Scripts (bei den anderen Slider-Variablen)
let isDragging2 = false;
let startX2 = 0;

const sliderContainer2 = document.querySelector('.slider2');

// Zentrale Logik für die Wisch-Richtung
function handleGesture2(endX2) {
    const swipeThreshold = 50; // Pixel-Toleranz
    if (startX2 - endX2 > swipeThreshold) {
        updateSlider2('next');
    } else if (endX2 - startX2 > swipeThreshold) {
        updateSlider2('prev');
    }
}

// 1. Touch-Events (Smartphone)
sliderContainer2.addEventListener('touchstart', (e) => {
    startX2 = e.changedTouches[0].screenX;
}, { passive: true });

sliderContainer2.addEventListener('touchend', (e) => {
    handleGesture2(e.changedTouches[0].screenX);
}, { passive: true });

// 2. Maus-Events (Desktop-Dragging)
sliderContainer2.addEventListener('mousedown', (e) => {
    isDragging2 = true;
    startX2 = e.screenX;
    // Optional: Ändert den Cursor sofort beim Klicken
    sliderContainer2.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', (e) => {
    if (!isDragging2) return;
    isDragging2 = false;
    sliderContainer2.style.cursor = 'grab';
    handleGesture2(e.screenX);
});

// Verhindert das "Herausziehen" von Bildern/Links
sliderContainer2.addEventListener('dragstart', (e) => e.preventDefault());

// OPTIONAL: Tastatur-Steuerung hinzufügen
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateSlider2('prev');
    if (e.key === 'ArrowRight') updateSlider2('next');
});