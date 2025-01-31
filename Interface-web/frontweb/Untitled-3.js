// Fonction pour mettre à jour l'état affiché
    async function fetchStatus() {
      try {
        const response = await fetch('/status'); // Requête GET au serveur
        const data = await response.json();

        document.getElementById('drawerStatus').textContent = data.drawerState;
        const alarmText = data.alarmArmed ? 'Armée' : 'Désarmée';
        const alarmClass = data.alarmArmed ? 'armed' : 'disarmed';

        const alarmStatus = document.getElementById('alarmStatus');
        alarmStatus.textContent = alarmText;
        alarmStatus.className = alarmClass;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'état:', error);
      }
    }

    // Fonction pour envoyer une commande pour armer/désarmer
    async function toggleAlarm() {
      try {
        const response = await fetch('/toggle-alarm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          fetchStatus(); // Mettre à jour l'état après modification
        }
      } catch (error) {
        console.error('Erreur lors du changement d\'état de l\'alarme:', error);
      }
    }

    // Mettre à jour l'état toutes les secondes
    setInterval(fetchStatus, 1000);

    // Gestion du clic sur le bouton
    document.getElementById('toggleAlarm').addEventListener('click', toggleAlarm);

    // Récupérer l'état initial au chargement de la page
    fetchStatus();