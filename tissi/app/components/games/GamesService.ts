/// <reference path="../../shared/references.ts"/>
module tissi.services {
    'use strict';

    export interface GamesServiceInterface {
        getPastGames(): { games: interfaces.Game[] };
    }

    export class GamesService implements GamesServiceInterface {

        static $inject = [
            "$http",
            "localStorageService",
        ];

        constructor(private $http: any,
                    private LocalStorageService: angular.local.storage.ILocalStorageService) {
        }

        public getPastGames() {
            var games: any = this.LocalStorageService.get("pastGames");
            return games;
        }
    }

    var module = angular.module('tissi');
    module.service("GamesService", GamesService);
}