// La classe AutoTyping définit le comportement de la frappe automatique
class AutoTyping {
  // Le constructeur prend le sélecteur de l'élément, le texte à afficher, et des options facultatives
  constructor(selector, text, options = {}) {
    // Initialisation des propriétés de la classe
    this.selector = selector;
    this.text = text;
    this.typeSpeed = options.typeSpeed || 150;
    this.deleteSpeed = options.deleteSpeed || 150;
    this.waitBeforeDelete = options.waitBeforeDelete || 1000;
    this.waitBetweenWords = options.waitBetweenWords || 1000;
    this.writeWhole = options.writeWhole || false;
    this.el = document.querySelector(selector); // Sélectionne l'élément dans le DOM
  }

  // La méthode start démarre l'effet de frappe automatique
  async start() {
    // Itération à travers chaque élément du tableau de texte
    for (let i = 0; i < this.text.length; i++) {
      // Convertit chaque mot en tableau de caractères si writeWhole est faux
      const chars = this.writeWhole ? [this.text[i]] : this.text[i].split('');
      // Appelle la méthode writeText pour écrire le texte
      await this.writeText(chars);
      // Si c'est le dernier mot, réinitialise i pour répéter le processus
      if (i === this.text.length - 1) {
        i = -1;
      }
    }
  }

  // La méthode writeText écrit le texte caractère par caractère
  writeText(chars) {
    return new Promise((resolve) => {
      const el = this.el; // Référence à l'élément HTML cible
      let isSpace = false; // Variable pour gérer les espaces
      const intervalId = setInterval(() => {
        let char = chars.shift(); // Prend le premier caractère du tableau
        // Ajoute un espace avant le caractère si la variable isSpace est vraie
        if (isSpace) {
          isSpace = false;
          char = ' ' + char;
        }
        // Si le caractère est un espace, met à jour la variable isSpace
        if (char === ' ') {
          isSpace = true;
        }
        el.innerText += char; // Ajoute le caractère à l'élément HTML
        // Si tous les caractères sont écrits
        if (chars.length === 0) {
          clearInterval(intervalId); // Arrête l'intervalle d'écriture
          // Attend un certain temps avant de commencer la suppression
          setTimeout(() => {
            let deleteIntervalId = setInterval(() => {
              const currentText = el.innerText;
              // Si writeWhole est vrai, efface tout le texte
              if (this.writeWhole) {
                el.innerText = '';
              } else {
                // Sinon, supprime le dernier caractère
                el.innerText = currentText.slice(0, -1);
              }
              // Si tout le texte est supprimé
              if (el.innerText.length === 0) {
                clearInterval(deleteIntervalId); // Arrête l'intervalle de suppression
                // Attend un certain temps avant de résoudre la promesse
                setTimeout(() => resolve(), this.waitBetweenWords);
              }
            }, this.deleteSpeed);
          }, this.waitBeforeDelete);
        }
      }, this.typeSpeed);
    });
  }
}

// Exemple d'utilisation de la classe AutoTyping
const exampleText = ['Développeur', 'À l école', 'CREA Genève'];
const exampleTyping = new AutoTyping('#text', exampleText, {
  typeSpeed: 100,
  deleteSpeed: 100,
  waitBeforeDelete: 2000,
  waitBetweenWords: 500,
});

// Démarrage de l'effet de frappe automatique
exampleTyping.start();
