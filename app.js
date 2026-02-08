const navbar = document.querySelector('nav');
const menuButton = document.querySelector('.menu-button');
const navContent = document.querySelector('.content');
const overlay = document.querySelector('.overlay');
const navSignImage = document.querySelector('.sign img');
const navSignH2 = document.querySelector('.sign h2');

/*-------------
Responsives Navbar Verhalten
--------------*/
const media = window.matchMedia('(max-width: 767px)');
media.addEventListener('change', updateNavbar);
updateNavbar(media);

function updateNavbar(e) {
    const isMobile = e.matches;

    if (isMobile) {
        document.documentElement.style.setProperty('--navbar-width', '100%');
        document.documentElement.style.setProperty('--navbar-height', '5em');
        navbar.style.setProperty('--navbar-height', '4em');
        navbar.style.setProperty('--opened-navbar-width', '100%');
        navbar.style.setProperty('--mobile-opened-navbar-margin', '0');
        navbar.style.setProperty('--navbar-margin', '1em');

        if (navbar.classList.contains('open')) {
            navbar.style.setProperty('--navbar-border-radius', '0');
        }
    } else {
        document.documentElement.style.setProperty('--navbar-width', '40%');
        document.documentElement.style.setProperty('--navbar-height', '5em');
        navbar.style.setProperty('--navbar-height', '5em');
        navbar.style.setProperty('--mobile-opened-navbar-margin', '2em');
        navbar.style.setProperty('--opened-navbar-width', '95%');
        navbar.style.setProperty('--navbar-margin', '2em');
        navbar.style.setProperty('--navbar-border-radius', '0.5em');
    }
}

/*---------------------
Globale Funktion zum Schließen
----------------------*/
function closeNav() {
    navbar.classList.remove("open");
    navbar.classList.add("close");

    menuButton.classList.remove("active");
    overlay.classList.remove("active");

    navContent.setAttribute('inert', '');
    navContent.setAttribute('aria-hidden', 'true'); 

    const mainContent = document.querySelector('#main-content');
    if (mainContent) mainContent.removeAttribute('inert');

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute('aria-label', 'Menü öffnen');

    // Border-Radius anpassen
    navbar.style.setProperty('--navbar-border-radius', '0.5em');

    menuButton.focus({ preventScroll: true });
}

/*---------------------
Menu Button Klick (Toggle)
----------------------*/
menuButton.addEventListener('click', () => {
    if (navbar.classList.contains('open')) {
        closeNav();
    } else {
        // Menü öffnen
        navbar.classList.remove('close');
        navbar.classList.add('open');
        menuButton.classList.add('active');
        overlay.classList.add('active');

        navContent.removeAttribute('inert');
        navContent.removeAttribute('aria-hidden');
        menuButton.setAttribute('aria-label', 'Menü schließen');
        
        const mainContent = document.querySelector('#main-content');
        if (mainContent) mainContent.setAttribute('inert', '');

        if (window.innerWidth < 767) {
            navbar.style.setProperty('--navbar-border-radius', '0');
        }

        const firstFocusable = navContent.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });

        navbar.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'openNav') {
                if (typeof setDiameter === 'function') setDiameter();
                navbar.removeEventListener('animationend', handler);
            }
        });
    }

    menuButton.setAttribute("aria-expanded", navbar.classList.contains('open') ? "true" : "false");
});

/*---------------------
Smart-Links & Overlay Logik
----------------------*/
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".menu-card a");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute('href');
            
            // Check, in welcher Card der Link sitzt
            const isFirstCard = link.closest('.menu-card:nth-child(1)');
            const isSecondCard = link.closest('.menu-card:nth-child(2)');

            // WICHTIG: Nur schließen bei Card 2 oder Anker-Links
            if (isSecondCard || (href && href.startsWith('#'))) {
                closeNav();
            } 
            // Bei Card 1 passiert nichts -> Navbar bleibt offen stehen für Seitenwechsel
        });
    });

    // Overlay schließt das Menü immer
    if (overlay) {
        overlay.addEventListener("click", closeNav);
    }

    // Verhalten auf der neuen Seite (z.B. kontakt.html)
    if (navbar.classList.contains('is-pre-opened')) {
        navbar.classList.add('open');
        menuButton.classList.add('active');
        overlay.classList.add('active');

        setTimeout(() => {
            navbar.classList.remove('is-pre-opened');
            closeNav(); 
        }, 250); /* hier bei der Zahl kann man einstellen wie schnell sie die navbar auf der neuen Seite schließt */
    }
});

/*---------------------
Hilfsfunktionen & Resize
----------------------*/
function updateNavbarSize() {
    if (window.innerWidth > 767) {
        const newWidth = (window.innerWidth * 0.4) + (window.innerWidth * 0.2);
        document.documentElement.style.setProperty('--navbar-width', `${newWidth}px`);
    } else {
        document.documentElement.style.setProperty('--navbar-width', '95%');
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateNavbarSize();
        if (typeof setDiameter === 'function') setDiameter();
    }, 200);
});

// Initialisierung
updateNavbarSize();
navbar.style.transform = 'translateY(0)';

/*---------------------
Tastatursteuerung
----------------------*/
menuButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuButton.click();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('open')) {
        closeNav();
    }
});



/* für die view-transition von page zu page */

window.addEventListener('load', () => {
    // Sobald alles geladen ist, blenden wir die Seite ein
    document.body.classList.add('loaded');
});

// Optional: Ausfaden beim Verlassen der Seite
document.querySelectorAll('.menu-card a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Nur bei echten Seitenwechseln ausfaden
        if (!href.startsWith('#')) {
            document.body.classList.remove('loaded');
        }
    });
});






/* kreis-slider in der navbar */


const setDiameter = () => {
    const menuCard = document.querySelector('.menu-card:nth-child(3)');
    if (!menuCard) return;

    const slider = menuCard.querySelector('.slider');
    if (!slider) return;

    // Größe der Karte holen
    const width = menuCard.clientWidth;
    const height = menuCard.clientHeight;

    // Kreis = kleiner Wert von Breite/Höhe
    const diameter = Math.min(width, height);

    // Slider anpassen
    slider.style.width = `${diameter}px`;
    slider.style.height = `${diameter}px`;
    slider.style.borderRadius = '50%';

    // CSS Variable für innere Elemente setzen, falls benötigt
    document.documentElement.style.setProperty('--diameter', `${diameter}px`);

    // Optional: zentrieren
    slider.style.position = 'absolute';
    slider.style.left = '50%';
    slider.style.top = '50%';
    slider.style.transform = 'translate(-50%, -50%)';
};

// Direkt beim Laden und beim Resize aufrufen
window.addEventListener('load', setDiameter);
window.addEventListener('resize', setDiameter);









// Alle Items auswählen
const items = document.querySelectorAll('.slider .item');

let currentIndex1 = 0; // Start mit dem ersten Item

// Funktion zum Aktivieren eines Items
function setActive(index) {
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    currentIndex1 = index; // aktuellen Index speichern
}

// Automatischer Wechsel alle 5 Sekunden
setInterval(() => {
    let nextIndex1 = currentIndex1 + 1;
    if (nextIndex1 >= items.length) nextIndex1 = 0;
    setActive(nextIndex1);
}, 5000); // 5000 ms = 5 Sekunden




/* Main */
// ===============================
// Kreisgröße berechnen
// ===============================
function updateCircleSize(){
    const stage = document.querySelector('.carousel-stage');
    if (!stage) return;

    const stageWidth = stage.offsetWidth;
    const stageHeight = stage.offsetHeight;

    const circleSize = Math.sqrt(
        stageWidth ** 2 + stageHeight ** 2
    );

    document.documentElement.style.setProperty(
        '--circle-size',
        `${circleSize}px`
    );
}

window.addEventListener('DOMContentLoaded', updateCircleSize);
window.addEventListener('resize', updateCircleSize);

const panels = document.querySelectorAll('.carousel-panel');
const btnPrev = document.querySelector('.carousel-prev');
const btnNext = document.querySelector('.carousel-next');
const track = document.querySelector('.carousel-track');

let activePanelIndex = 1; // Start bei Panel 2
const firstPanel = 0;
const lastPanel = panels.length - 1;

// Array mit den passenden Hintergrundbildern für jedes Panel
const trackBackgrounds = [
    "url('img/ichaufkaiser.png')",
    "url('img/Weihnachtskonzert.png')",
    "url('img/image10.png')"
];

function activatePanel(index) {
    // 1. Animation des Model-Bildes zurücksetzen
    track.classList.remove('animate');
    
    // 2. Panels umschalten
    panels.forEach((panel, i) => {
        panel.classList.toggle('is-active', i === index);
    });

    // 3. Hintergrundbild des Tracks setzen
    track.style.setProperty('--track-bg', trackBackgrounds[index]);

    // 4. Force Reflow & Animation neu starten
    void track.offsetWidth; 
    track.classList.add('animate');

    // 5. Button-Sichtbarkeit
    btnPrev.style.visibility = (index === firstPanel) ? 'hidden' : 'visible';
    btnNext.style.visibility = (index === lastPanel) ? 'hidden' : 'visible';
}

// Initial aktivieren
activatePanel(activePanelIndex);

// Buttons Events
btnNext.addEventListener('click', () => {
    if(activePanelIndex < lastPanel){
        activePanelIndex++;
        activatePanel(activePanelIndex);
    }
});

btnPrev.addEventListener('click', () => {
    if(activePanelIndex > firstPanel){
        activePanelIndex--;
        activatePanel(activePanelIndex);
    }
});




/* card slider */



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