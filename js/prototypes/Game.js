"use strict";

import { Enemy, Player } from "./Character.js";
import { getRandomArbitrary } from "../lib/helpers.js";

function Game() {
  this.started = false;
  this.win = false;
  this.lose = false;
  this.playerCharacters = [];
  this.currentPlayerCharacter = new Player();
  this.currentPlayerCharacterIndex = 0;
  this.enemy = new Enemy();
}

Game.prototype = {
  start: function () {
    this.started = true;
  },

  end: function () {
    this.started = false;
  },

  exit: function () {
    this.started = false;
  },

  addPlayerCharacter: function (character) {
    this.playerCharacters.push(character);
  },

  selectPlayerCharacter: function (index) {
    this.currentPlayerCharacter = this.playerCharacters[index];
    this.currentPlayerCharacterIndex = index;
  },

  setEnemyCharacter: function (character) {
    this.enemy = character;
  },

  createCharacter: function (character, type) {
    return type === "player"
      ? new Player(
          character.id,
          character.name,
          character.hp,
          character.attackDamage,
          character.defense,
          character.critical,
          character.attackSpeed,
          character.img,
          character.healAmount,
          character.healColdown,
          character.switchColdown
        )
      : new Enemy(
          character.id,
          character.name,
          character.hp,
          character.attackDamage,
          character.defense,
          character.critical,
          character.attackSpeed,
          character.img
        );
  },

  killCharacter: function () {
    this.playerCharacters = this.playerCharacters.filter(
      (character) => character.id !== this.currentPlayerCharacter.id
    );
    this.selectPlayerCharacter(0);
    if (this.playerCharacters.length === 0) {
      this.lose = true;
      this.end();
    }
  },

  attackEnemy: function () {
    const criticalAttack =
      Math.random() <= this.currentPlayerCharacter.critical;
    const damage = Math.round(
      this.currentPlayerCharacter.attackDamage * getRandomArbitrary(0.8, 1)
    );

    this.enemy.damage(damage, criticalAttack);
    if (!this.enemy.alive) {
      this.win = true;
      this.end();
    }
  },

  attackPlayer: function () {
    const criticalAttack = Math.random() <= this.enemy.critical;
    const damage = Math.round(
      this.enemy.attackDamage * getRandomArbitrary(0.8, 1)
    );

    this.currentPlayerCharacter.damage(damage, criticalAttack);
    if (this.currentPlayerCharacter.currentHP <= 0) this.killCharacter();
  },
};

export default Game;
