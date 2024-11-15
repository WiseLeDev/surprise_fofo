document.querySelectorAll('.surprise-block').forEach((block, index) => {
    const countdown = block.querySelector('.countdown');
    const button = block.querySelector('.surprise-button');
    const message = block.querySelector('.message');
    const now = new Date().getTime();
    const testTimes = [
        now - 1000, // Déjà disponible
        now + 5000, // Disponible dans 5 secondes
        now + 10000, // Disponible dans 10 secondes
        now + 15000, // Disponible dans 15 secondes
        now + 20000, // Disponible dans 20 secondes
        now + 5000, // Disponible dans 25 secondes
        now + 5000  // Disponible dans 30 secondes
    ];
    const targetTime = testTimes[index];
    const surpriseKey = `surprise_${index}`; 

    if (localStorage.getItem(surpriseKey) === "opened") {
        button.disabled = true;
        countdown.textContent = "Déjà ouvert 😞";
        button.textContent = "Malheureusement, cette surprise a déjà été ouverte.";
        button.style.backgroundColor = "red";
        return;
    }

    let listenerAdded = false;

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const timeLeft = targetTime - currentTime;

        if (index === 6 && localStorage.getItem(`surprise_5`) === "opened") {
            block.style.display = "block";
        }

        if (timeLeft <= 0) {
            countdown.textContent = "Disponible ! 🎉";
            button.disabled = false; // Active le bouton

            if (!listenerAdded) {
                listenerAdded = true; // Empêche d'ajouter plusieurs écouteurs
                button.addEventListener('click', () => {
                    const number = parseInt(block.querySelector('h2').textContent.match(/\d+/)[0]); 
                    let message = "";
                    switch (number){
                        case 1:
                            message = `Une carte cadeau BeautyNailByMylene de 30€`;
                            break;
                        case 2:
                            message = `Une montre rose`;
                            break;
                        case 2:
                            message = `Une doudoune`;
                            break;

                    }


                    alert(`${message} 🎁 !`);
                    button.disabled = true;
                    countdown.textContent = "Déjà ouvert 😞";
                    button.textContent = "Malheureusement, cette surprise a déjà été ouverte.";
                    button.style.backgroundColor = "red";
                    localStorage.setItem(surpriseKey, "opened");
                }, { once: true });
            }
        } else {
            const seconds = Math.floor(timeLeft / 1000);
            countdown.textContent = `${seconds}s restantes`;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
