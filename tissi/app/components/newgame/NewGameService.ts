/// <reference path="../../shared/references.ts"/>
module tissi.services {
    'use strict';

    export interface NewGameServiceInterface {
        sendEvent(game:interfaces.Game, event: string): ng.IHttpPromise<any>;
    }

    export class NewGameService {

        static $inject = [
            "$http",
            "$log",
            "base64",
            "UserService"
        ];

        constructor(private $http: any, private $log: any, private base64, private UserService: tissi.services.UserServiceInterface) {
        }

        public sendEvent = (game: interfaces.Game, event:string) => {

            var dt = new Date();
            var now = dt.toJSON();
            var userId = this.UserService.getUserId() || 0;
            var score: interfaces.EventData = {
                team1: game.team1,
                team2: game.team2,
                team1score: game.team1score,
                team2score: game.team2score,
                id: game.id,
                time: now,
                userId: userId,
                event: event

            };

            var scoreStr = JSON.stringify(score);
            var base = this.base64.urlencode(scoreStr);

            var tulospalvelubackend = "http://example.com/results.php?data=" + base;
            return this.$http.get(tulospalvelubackend);
        }
    }

    var module = angular.module('tissi');
    module.service("NewGameService", NewGameService);
}