// ===============================
// Kreisgröße berechnen
// ===============================
function updateCircleSize(){
    const stage = document.querySelector('#carousel-stage');
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
