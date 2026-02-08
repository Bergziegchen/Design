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

function getFocusableNavElements() {
    return Array.from(
        navContent.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => el.offsetParent !== null);
}

document.addEventListener('keydown', (e) => {
    if (!navbar.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const focusables = getFocusableNavElements();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // TAB vom letzten Element → Menü schließen
    if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        closeNav();
        return;
    }

    // SHIFT + TAB vom ersten Element → Menü schließen
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
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

