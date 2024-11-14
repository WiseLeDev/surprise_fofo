alert("script.js est chargé");

const revealButton = document.getElementById('revealButton');
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');

function getRemainingTime() {
    const now = new Date().getTime();
    const lastClickTime = localStorage.getItem('lastClickTime');
    const nextClickTime = new Date(parseInt(lastClickTime) + 24 * 60 * 60 * 1000).getTime();
    const remainingTime = nextClickTime - now;

    return remainingTime > 0 ? remainingTime : 0;
}

function startCountdown() {
    const interval = setInterval(() => {
        const remainingTime = getRemainingTime();
        if (remainingTime <= 0) {
            clearInterval(interval);
            countdownElement.innerText = "Disponible !";
            revealButton.disabled = false;
            messageElement.innerText = "Clique pour découvrir la surprise du jour !";
        } else {
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function revealSurprise() {
    messageElement.innerText = "Surprise révélée ! Profitez de votre jour 🎉";
    revealButton.disabled = true;

    const now = new Date().getTime();
    localStorage.setItem('lastClickTime', now);

    startCountdown();
}

// Initialisation de la page
window.onload = function() {
    const remainingTime = getRemainingTime();
    if (remainingTime > 0) {
        revealButton.disabled = true;
        startCountdown();
    } else {
        countdownElement.innerText = "Disponible !";
    }
};

revealButton.addEventListener("click", function() {
    alert("test");
});
