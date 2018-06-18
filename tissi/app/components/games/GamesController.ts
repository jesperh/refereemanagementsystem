module tissi {
    'use strict';

    export class GamesController {

        static $inject = [
            "GamesService",
            "pastGamesData",
            "localStorageService"
        ];

        public pastGames: interfaces.Game[];
        public unfinishedGame: interfaces.Game;

        constructor(private GamesService: tissi.services.GamesService, private pastGamesData, private LocalStorageService: angular.local.storage.ILocalStorageService) {

            if (!pastGamesData) {
                this.pastGames = [];
            } else {
                this.pastGames = pastGamesData.games || [];
            }

            var unFinishedGame: any = LocalStorageService.get('unfinishedgame');

            if (unFinishedGame) {
                this.unfinishedGame = unFinishedGame.game;
            }
        }

        public getTeamClass = (team1score, team2score) => {
            if (team1score === team2score) {
                return "games__result-draw";
            }
            if (team1score > team2score) {
                return "games__result-winner"
            }
            if (team1score < team2score) {
                return "game__result-loser";
            }
        };
    }

    var app = angular.module('tissi');
    app.controller('GamesController', GamesController);
}
;