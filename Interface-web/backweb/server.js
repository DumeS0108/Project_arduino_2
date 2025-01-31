// Fonction pour mettre à jour les statuts
async function fetchStatus() {
  try {
    const response = await fetch('/status'); // Requête GET au serveur
    const data = await response.json();

    // Mettre à jour le statut du tiroir
    const drawerStatusElement = document.getElementById('drawerStatus');
    drawerStatusElement.textContent = data.drawerState === 'OPEN' ? 'Ouvert' : 'Fermé';
    drawerStatusElement.className = data.drawerState === 'OPEN' ? 'open' : 'closed';

    // Mettre à jour le statut de l'alarme
    const alarmStatusElement = document.getElementById('alarmStatus');
    alarmStatusElement.textContent = data.alarmArmed ? 'Armée' : 'Désarmée';
    alarmStatusElement.className = data.alarmArmed ? 'armed' : 'disarmed';
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts:', error);
  }
}

// Fonction pour armer ou désarmer l'alarme
async function toggleAlarm() {
  try {
    const response = await fetch('/toggle-alarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.success) {
      fetchStatus(); // Actualiser les statuts après modification
    }
  } catch (error) {
    console.error('Erreur lors du changement de l\'état de l\'alarme:', error);
  }
}

// Rafraîchir les statuts toutes les secondes
setInterval(fetchStatus, 1000);

// Gestion du clic sur le bouton
document.getElementById('toggleAlarm').addEventListener('click', toggleAlarm);

// Charger les statuts initiaux
fetchStatus();
