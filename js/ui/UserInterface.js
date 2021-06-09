"use strict";

import Game from "../prototypes/Game.js";

function UI() {
  this.game = new Game();
  this.attackButton = document.querySelector(".action-btn.attack");
  this.healButton = document.querySelector(".action-btn.heal");
  this.switchButton = document.querySelector(".action-btn.switch");
  this.exitButton = document.querySelector(".action-btn.exit");
  this.playButton = document.getElementById("play-button");
  this.characterSelection1 = document.querySelector(
    ".character-selection-dropdown.character-1"
  );
  this.characterSelection2 = document.querySelector(
    ".character-selection-dropdown.character-2"
  );
  this.startScreen = document.querySelector(".start-screen");
  this.endScreen = document.querySelector(".end-screen");
  this.coldownTimers = {
    attack: 0,
    heal: 0,
    switch: 0,
  };
  this.playerCharacters = [];
  this.enemyCharacters = [];
  this.playerCurrentCharacter = {
    name: document.querySelector(".player .character-info .character-name"),
    hpBar: document.querySelector(
      ".player .character-info .hp-bar .current-hp"
    ),
    hpLabelCurrent: document.querySelector(
      ".player .character-info .hp-label .hp-label-current"
    ),
    hpLabelTotal: document.querySelector(
      ".player .character-info .hp-label .hp-label-total"
    ),
    sprite: document.querySelector(".player .character-sprite img"),
  };
  this.enemyCharacter = {
    name: document.querySelector(".enemy .character-info .character-name"),
    hpBar: document.querySelector(".enemy .character-info .hp-bar .current-hp"),
    hpLabelCurrent: document.querySelector(
      ".enemy .character-info .hp-label .hp-label-current"
    ),
    hpLabelTotal: document.querySelector(
      ".enemy .character-info .hp-label .hp-label-total"
    ),
    sprite: document.querySelector(".enemy .character-sprite img"),
  };
}

UI.prototype = {
  initialize: function () {
    this.playButton.addEventListener("click", () => {
      if (
        this.characterSelection1.value === "0" ||
        this.characterSelection2.value === "0"
      )
        return alert("Debes seleccionar ambos personajes para jugar.");

      this.setControls(false);
      this.playButton.setAttribute("disabled", true);
      this.characterSelection1.setAttribute("disabled", true);
      this.characterSelection2.setAttribute("disabled", true);

      // Player
      this.game.addPlayerCharacter(
        this.game.createCharacter(
          this.playerCharacters.find(
            (character) => character.id === this.characterSelection1.value
          ),
          "player"
        )
      );
      this.game.addPlayerCharacter(
        this.game.createCharacter(
          this.playerCharacters.find(
            (character) => character.id === this.characterSelection2.value
          ),
          "player"
        )
      );

      this.game.selectPlayerCharacter(0);

      this.updatePlayerCharacterUI();

      // Enemy
      this.game.setEnemyCharacter(
        this.game.createCharacter(this.enemyCharacters[0], "enemy")
      );

      this.updateEnemyCharacterUI();
      this.startGame(this);
    });

    this.exitButton.addEventListener("click", () => {
      this.setControls(true);
      this.playButton.removeAttribute("disabled");
      this.characterSelection1.value = 0;
      this.characterSelection2.value = 0;
      this.characterSelection1.removeAttribute("disabled");
      this.setEndScreen("none");
      this.setStartScreen("block");
    });

    this.characterSelection1.addEventListener("change", (event) => {
      if (event.target.value !== 0) {
        while (this.characterSelection2.lastChild) {
          this.characterSelection2.removeChild(
            this.characterSelection2.lastChild
          );
        }
        const option = document.createElement("option");

        option.setAttribute("value", "0");
        option.setAttribute("disabled", true);
        option.textContent = "Seleccionar Personaje 2";

        this.characterSelection2.appendChild(option);

        const filteredCharacters = this.playerCharacters.filter(
          (character) => character.id !== event.target.value
        );

        for (const character of filteredCharacters) {
          const option = document.createElement("option");

          option.setAttribute("value", character.id);
          option.textContent = character.name;

          this.characterSelection2.appendChild(option);
        }
        this.characterSelection2.removeAttribute("disabled");
      }
    });

    this.switchButton.addEventListener("click", () => {
      if (this.game.currentPlayerCharacterIndex === 0)
        this.game.selectPlayerCharacter(1);
      else this.game.selectPlayerCharacter(0);

      this.updatePlayerCharacterUI();
      this.switchButton.setAttribute("disabled", true);
      this.setOnColdown(
        this.switchButton,
        this.game.currentPlayerCharacter.switchColdown,
        "switch"
      );
    });

    this.attackButton.addEventListener("click", () => {
      this.game.attackEnemy();
      this.updateEnemyCharacterUI();
      this.attackButton.setAttribute("disabled", true);
      this.setOnColdown(
        this.attackButton,
        this.game.currentPlayerCharacter.attackSpeed,
        "attack"
      );

      if (this.game.win || this.game.lose) this.setEndScreen("block");
    });

    this.healButton.addEventListener("click", () => {
      this.game.currentPlayerCharacter.heal();
      this.updatePlayerCharacterUI();
      this.healButton.setAttribute("disabled", true);
      this.setOnColdown(
        this.healButton,
        this.game.currentPlayerCharacter.healColdown,
        "heal"
      );
    });

    this.characterSelection2.setAttribute("disabled", true);
    this.setControls(true);
    this.loadCharacters(this);
    this.setStartScreen("block");
  },

  setControls: function (value) {
    const controlBtns = [
      this.attackButton,
      this.healButton,
      this.switchButton,
      this.exitButton,
    ];

    for (const btn of controlBtns) {
      if (value) btn.setAttribute("disabled", value);
      else btn.removeAttribute("disabled");
    }
  },

  loadCharacters: function (context) {
    try {
      fetch("./data/characters.json")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (const character of data) {
            const option = document.createElement("option");

            option.setAttribute("value", character.id);
            option.textContent = character.name;

            context.characterSelection1.appendChild(option);
            context.playerCharacters.push(character);
          }
        });

      fetch("./data/enemies.json")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (const character of data) {
            const option = document.createElement("option");

            option.setAttribute("value", character.id);
            option.textContent = character.name;

            context.enemyCharacters.push(character);
          }
        });
    } catch (error) {
      console.error(error);
      const option = document.createElement("option");

      option.setAttribute("value", "1");
      option.textContent = "No se encontraron personajes";

      context.characterSelection1.appendChild(option);
    }
  },

  updatePlayerCharacterUI: function () {
    this.playerCurrentCharacter.name.textContent =
      this.game.currentPlayerCharacter.name;
    this.playerCurrentCharacter.hpLabelCurrent.textContent =
      this.game.currentPlayerCharacter.currentHP;
    this.playerCurrentCharacter.hpLabelTotal.textContent =
      this.game.currentPlayerCharacter.maxHP;
    this.playerCurrentCharacter.sprite.src =
      this.game.currentPlayerCharacter.img;

    const currentHPBarWidth = Math.ceil(
      (this.game.currentPlayerCharacter.currentHP /
        this.game.currentPlayerCharacter.maxHP) *
        100
    );

    this.playerCurrentCharacter.hpBar.style.width = `${currentHPBarWidth}%`;
  },

  updateEnemyCharacterUI: function () {
    this.enemyCharacter.name.textContent = this.game.enemy.name;
    this.enemyCharacter.hpLabelCurrent.textContent = this.game.enemy.currentHP;
    this.enemyCharacter.hpLabelTotal.textContent = this.game.enemy.maxHP;
    this.enemyCharacter.sprite.src = this.game.enemy.img;

    const currentHPBarWidth = Math.ceil(
      (this.game.enemy.currentHP / this.game.enemy.maxHP) * 100
    );

    this.enemyCharacter.hpBar.style.width = `${currentHPBarWidth}%`;
  },

  startGame: function (context) {
    this.setStartScreen("none");
    this.game.start();
    this.game.enemy.timerID = setInterval(() => {
      if (this.game.started) {
        context.game.attackPlayer();
        if (!this.game.win && !this.game.lose) this.updatePlayerCharacterUI();
        if (this.game.win || this.game.lose) {
          clearInterval(this.game.enemy.timerID);
          this.setEndScreen("block");
        }
      }
    }, 3000 * (1 / context.game.enemy.attackSpeed));
  },

  setOnColdown: function (element, coldown, type) {
    element.textContent = coldown;
    this.coldownTimers[type] = setInterval(() => {
      coldown -= 1;
      element.textContent = coldown;
      if (coldown <= 0) {
        clearInterval(this.coldownTimers[type]);
        switch (type) {
          case "attack":
            element.textContent = "Atacar";
            element.removeAttribute("disabled");
            break;
          case "heal":
            element.textContent = "Curar";
            element.removeAttribute("disabled");
            break;
          case "switch":
            element.textContent = "Cambiar";
            element.removeAttribute("disabled");
            break;
        }
      }
    }, 1000);
  },

  setEndScreen: function (display) {
    this.endScreen.style.display = display;
    this.endScreen.textContent = this.game.win ? "You win!" : "Game Over";
  },

  setStartScreen: function (display) {
    this.startScreen.style.display = display;
  },
};

export default UI;
