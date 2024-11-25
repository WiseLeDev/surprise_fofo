document.querySelectorAll('.surprise-block').forEach((block, index) => {
    const countdown = block.querySelector('.countdown');
    const button = block.querySelector('.surprise-button');
    const surpriseContent = document.createElement('div');
    const debugMode = false; // Passez à `false` pour réactiver les délais
    surpriseContent.classList.add('surprise-content');

    const surprises = [
        `🎉 Une montre rose gold !`,
        `🎉 Une carte cadeau BeautyNail ByMylène de 35€ !`,
        `🎉 Un petit texte !`,
        `🎉 Une clef USB !`,
        `🎉 Vaiana 2, quand tu veux !`,
        `🎉 .. !`,
        `🎉 Rose + chocolat !`,
        `🎉 Tu dors à la maison + film !`
    ];

    surpriseContent.textContent = surprises[index] || `🎉 Surprise inconnue !`;
    block.appendChild(surpriseContent);

    const surpriseKey = `surprise_${index}`;
    const calibrationKey = `calibration_${index + 1}`;

    let listenerAdded = false;

    if (index === 7 && localStorage.getItem(`surprise_6`) !== "opened") {
        block.hidden = true; // Cache le bloc si la surprise 6 n'est pas encore ouverte
        return;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const previousOpened = index === 0 || localStorage.getItem(`surprise_${index - 1}`) === "opened";
    
        if (index === 7 && localStorage.getItem(`surprise_6`) !== "opened") {
            block.hidden = true; // Cache le bloc si la surprise 8 n'est pas encore ouverte
            return;
        } else if (index === 7) {
            block.hidden = false; // Affiche le bloc une fois la 7e surprise ouverte
        }
    
        // S'assurer que la surprise précédente est bien ouverte
        if (!previousOpened) {
            countdown.textContent = "En attente du jour précédent...";
            button.disabled = true;
            return;
        }
    
        // Récupérer ou calculer le moment d'ouverture attendu
        let targetTime = parseInt(localStorage.getItem(calibrationKey), 10);
        if (!targetTime && index !== 0) {
            const previousOpenTime = parseInt(localStorage.getItem(`calibration_${index}`), 10);
            if (previousOpenTime) {
                targetTime = previousOpenTime + 24 * 60 * 60 * 1000; // Ajoute 24 heures
                localStorage.setItem(calibrationKey, targetTime);
            }
        }
    
        const timeLeft = targetTime ? targetTime - now : 0;
    
        if (debugMode || timeLeft <= 0) {
            // Si debugMode est activé ou si la surprise est disponible
            countdown.textContent = "Disponible ! 🎉";
            button.disabled = false;
    
            if (!listenerAdded) {
                listenerAdded = true;
                button.addEventListener(
                    "click",
                    () => {
                        // Revalidation : vérifier si la condition est respectée au moment du clic
                        if (!debugMode && targetTime && now < targetTime) {
                            alert("Vous ne pouvez pas encore ouvrir cette surprise !");
                            return;
                        }
    
                        // Dérouler l'animation d'ouverture
                        block.classList.add("opening");
    
                        setTimeout(() => {
                            surpriseContent.style.opacity = 1;
                            surpriseContent.style.transform = "translateY(0)";
                        }, 1000);
    
                        // Sauvegarder l'état dans le localStorage
                        const openedTime = new Date().getTime();
                        localStorage.setItem(surpriseKey, "opened");
                        localStorage.setItem(`calibration_${index + 1}`, openedTime);
    
                        button.disabled = true;
                        button.classList.add("clicked");
                        button.textContent = "Déjà ouvert ! 🎁";
                    },
                    { once: true }
                );
            }
    
            // Si quelqu'un manipule localStorage pour ouvrir cette surprise alors que ce n'est pas le moment
            if (localStorage.getItem(surpriseKey) !== "opened") {
                surpriseContent.style.opacity = 0;
                surpriseContent.style.transform = "translateY(20px)";
                surpriseContent.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            }
        } else {
            // Si le temps restant est supérieur à 0, afficher le compte à rebours
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            countdown.textContent = `${hours}h ${minutes}m ${seconds}s restantes`;
            button.disabled = true;
        }
    }

    // Initialiser le contenu masqué
    surpriseContent.style.opacity = 0;
    surpriseContent.style.transform = "translateY(20px)";
    surpriseContent.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    updateCountdown();
    setInterval(updateCountdown, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("confidential-modal");
    const closeButton = document.getElementById("close-modal-button");

    // Afficher la popup
    modal.classList.add("show");

    // Fermer la popup lorsque le bouton est cliqué
    closeButton.addEventListener("click", () => {
        modal.classList.remove("show");
    });
});
