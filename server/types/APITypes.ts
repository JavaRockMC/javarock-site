/**
 * More can and probably will be added to this
 */
export interface PlayerStats {
    dir: string, // The path from which the request is to be sent to
    username: null | string, // A player's username. Is null if there is no player.
    inDiscord?: boolean, // Whether the player is in the Discord or not. Omitted if there is no player
    data: { // Stats
        blocksMined: number, // How many blocks a player/all players have mined
        blocksPlaced: number, // How many blocks a player/all players have placed
        mobsKilled: number, // How many mobs players/a player has defeated
        totalDeaths: number, // How many times a player/all players have been defeated
        timesSlept: number, // How many times a player/all players have slept
        distanceTravelled: number, // How far a player/all players have travelled
        totalTimePlayed: string | number, // How long a player/all players have played for
    } | object
}

export interface WorldStats {
    dir: string,
    data: {
        totalPlayers: number,
        spawnBiome: string, // this is not guaranteed to exist in the final product
        playersBanned: number,
        currentUptime: string | number,
        worldTime: string
    }
}