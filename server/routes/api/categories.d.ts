export type category = "blocks" | "mobs" | "time" |"misc"

export interface Categories {
    Blocks: Blocks;
    Mobs: Mobs;
    Time: Time;
    Misc: Misc;
}

export interface Blocks {
    mined: number;
    placed: number;
    // can be expanded
}

export interface Mobs {
    defeatedMob: number;
    defeatedByMob: number;
    distanceByHorse: number;
    distanceByPig: number;
    distanceByStrider: number;
    fishCaught: number;
    talkedToVillager: number;
}

export interface Time { }

export interface Misc { }
