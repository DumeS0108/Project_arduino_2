// Sélection des éléments HTML
const drawerStatusBox = document.getElementById('drawerStatus');
const alarmStatusText = document.getElementById('alarmStatus');
const toggleAlarmBtn = document.getElementById('toggleAlarmBtn');

// Variables
let isAlarmArmed = true; // Alarme activée par défaut
let drawerState = 'CLOSED'; // Tiroir fermé par défaut

// Mise à jour de l'état du tiroir
function updateDrawerStatus() {
    if (drawerState === 'OPEN') {
        drawerStatusBox.textContent = 'Tiroir ouvert';
        drawerStatusBox.className = 'status open';
    } else {
        drawerStatusBox.textContent = 'Tiroir fermé';
        drawerStatusBox.className = 'status closed';
    }
}

// Mise à jour de l'état de l'alarme
function updateAlarmStatus() {
    if (isAlarmArmed) {
        alarmStatusText.textContent = 'Armée';
        alarmStatusText.className = 'status armed';
        toggleAlarmBtn.classList.add('active');
        toggleAlarmBtn.textContent = 'Désarmer l\'alarme';
    } else {
        alarmStatusText.textContent = 'Désarmée';
        alarmStatusText.className = 'status disarmed';
        toggleAlarmBtn.classList.remove('active');
        toggleAlarmBtn.textContent = 'Armer l\'alarme';
    }
}

// Changer l'état de l'alarme et rafraîchir la page
function toggleAlarm() {
    fetch('/toggle-alarm', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            isAlarmArmed = data.alarmArmed;
            updateAlarmStatus();
            setTimeout(() => {
                location.reload(); // Rechargement automatique
            }, 500);
        })
        .catch(err => console.error('Erreur:', err));
}

// Rafraîchir l'état toutes les 2 secondes (Polling)
function refreshState() {
    fetch('/status')
        .then(response => response.json())
        .then(data => {
            drawerState = data.drawerState;
            isAlarmArmed = data.alarmArmed;
            updateDrawerStatus();
            updateAlarmStatus();
        })
        .catch(err => console.error('Erreur:', err));
}

// Mise à jour automatique
setInterval(refreshState, 2000);
toggleAlarmBtn.addEventListener('click', toggleAlarm);
refreshState();
