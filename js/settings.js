/*

Settings is object containing buff / debuff / enemy's situation like 1 vs 1 
or currenct state of character (HP), subdeck stats,
and other damage calculation related values

*/

class Setting {
    constructor() {
        this.magicMod = 1;
        this.attackMod = 1;
        this.statMod = 1;
        this.additionalMagic = 1;
        this.additionalAttack = 1;
        this.enemyHP = 100;
        this.playerHP = 100;
        this.enemyElement = null;
    }

    getEE() {
        return 0;
    }

    getMagicMod() {
        return 1;
    }

    getAttackMod() {
        return 1;
    }

    isOppositeElement(element) {
        return true;
    }
}

export { Setting };
