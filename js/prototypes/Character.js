"use strict";

function Character(
  id,
  name,
  maxHP,
  attackDamage,
  defense,
  critical,
  attackSpeed,
  img
) {
  this.id = id;
  this.name = name;
  this.maxHP = maxHP;
  this.currentHP = maxHP;
  this.attackDamage = attackDamage;
  this.defense = defense;
  this.critical = critical;
  this.attackSpeed = attackSpeed;
  this.img = img;
  this.alive = true;
}

Character.prototype.damage = function (amount, critical) {
  const damage = amount - Math.round(this.defense / 10);
  const finalDamage = Math.round(critical ? amount * 1.25 : damage);
  this.currentHP -= finalDamage;

  console.log(
    `${this.name} ha recibido ${finalDamage} puntos de daño. ${
      critical ? "Golpe crítico!" : ""
    }`
  );
  console.log(`HP: ${this.currentHP <= 0 ? 0 : this.currentHP}.`);

  if (this.currentHP <= 0) {
    this.currentHP = 0;
    this.alive = false;
    console.log(`${this.name} ha sido derrotado.`);
  }
};

function Player(
  id,
  name,
  maxHP,
  attackDamage,
  defense,
  critical,
  attackSpeed,
  img,
  healAmount,
  healColdown,
  switchColdown
) {
  Character.call(
    this,
    id,
    name,
    maxHP,
    attackDamage,
    defense,
    critical,
    attackSpeed,
    img
  );
  this.healAmount = healAmount;
  this.healColdown = healColdown;
  this.switchColdown = switchColdown;
}

function Enemy(
  id,
  name,
  maxHP,
  attackDamage,
  defense,
  critical,
  attackSpeed,
  img
) {
  Character.call(
    this,
    id,
    name,
    maxHP,
    attackDamage,
    defense,
    critical,
    attackSpeed,
    img
  );
  this.timerID = 0;
}

//Make sure that the new sub object is part of the prototype chain
Player.prototype = Object.create(Character.prototype);
Enemy.prototype = Object.create(Character.prototype);

Player.prototype.heal = function () {
  this.currentHP += this.healAmount;

  if (this.currentHP > this.maxHP) this.currentHP = this.maxHP;

  console.log(`${this.name} se ha curado ${this.healAmount} puntos de daño.`);
  console.log(`HP: ${this.currentHP}.`);
};

export { Player, Enemy };
