module tissi {
    'use strict';

    //TODO: refactor the whole thing and take advantage of typescript classes
    //class HalfGame implements interfaces.GameHalfInterface {
    //    constructor(public ready: boolean, public team1score: interfaces.GameHalfScoreInterface, public team2score: interfaces.GameHalfScoreInterface) {}
    //    private calculateScore = () => {
    //
    //    }
    //}

    export class NewGameController {

        static $inject = [
            "NewGameService",
            "$filter",
            "$timeout",
            "localStorageService",
            "$state",
            "$scope"
        ];

        public firstHalf: interfaces.GameHalfInterface;
        public secondHalf: interfaces.GameHalfInterface;
        public overtime: interfaces.GameHalfInterface;
        public game: interfaces.Game;
        public teamsList: interfaces.Team[];
        public confirmStart: boolean;
        public team1name: string;
        public team2name: string;
        public sendResultsFailed: boolean;
        public sendingResults: boolean;
        public draw: boolean;
        public playOvertime: boolean;
        public sameTeamError: boolean;

        constructor(private NewGameService: tissi.services.NewGameService,
                    private $filter: ng.IFilterService,
                    private $timeout: ng.ITimeoutService,
                    private LocalStorageService: angular.local.storage.ILocalStorageService,
                    private $state,
                    private $scope: ng.IScope
        ) {

            var unFinishedGame:any = this.LocalStorageService.get('unfinishedgame');

            this.teamsList = [
                {"id":"1","name":"Team NUmber ONE"},
                {"id":"2","name":"Kyykkaeaejaet"},
                {"id":"3","name":"Oulun Peli Seura"},
                {"id":"4","name":"Herwanna Hurjat"},
                {"id":"5","name":"Pehmeät Jänikset"},
                {"id":"6","name":"Team International"},
                {"id":"7","name":"MinttuKaakao"},
                {"id":"8","name":"Asiallinen joukkueen nimi"},
                {"id":"9","name":"Jallun Pihtaajat"}
            ];

            if(unFinishedGame) {
                this.game = unFinishedGame.game;
                this.firstHalf = unFinishedGame.firstHalf;
                this.secondHalf = unFinishedGame.secondHalf;
                this.overtime = unFinishedGame.overtime;

                this.firstHalf.team1score.updateGameTotalScore = () => { this.calculateGameTotalScore("team1") } //refactor this s***
                this.firstHalf.team2score.updateGameTotalScore = () => { this.calculateGameTotalScore("team2") } //refactor this s***
                this.secondHalf.team1score.updateGameTotalScore = () => { this.calculateGameTotalScore("team1") } //refactor this s***
                this.secondHalf.team2score.updateGameTotalScore = () => { this.calculateGameTotalScore("team2") } //refactor this s***
                this.overtime.team1score.updateGameTotalScore = () => { this.calculateGameTotalScore("team1") } //refactor this s***
                this.overtime.team2score.updateGameTotalScore = () => { this.calculateGameTotalScore("team2") } //refactor this s***

            } else {

                this.game = {
                    started: false,
                    ready: false,
                    team1: null,
                    team2: null,
                    team1score: 0,
                    team2score: 0,
                    id: null,
                    start:null
                };

                this.firstHalf = {
                    ready: false,
                    team1score: {
                        pappis:0,
                        akkas: 0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team1") } //refactor this s***
                    },
                    team2score: {
                        pappis: 0,
                        akkas: 0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team2") } //refactor this s***
                    }
                };

                this.secondHalf = {
                    ready: false,
                    team1score: {
                        pappis: 0,
                        akkas: 0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team1") } //refactor this s***
                    },
                    team2score: {
                        pappis: 0,
                        akkas: 0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team2") } //refactor this s***
                    }
                };

                this.overtime = {
                    ready: false,
                    team1score: {
                        pappis:0,
                        akkas:0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team1") }
                    },
                    team2score: {
                        pappis:0,
                        akkas:0,
                        totalScore:0,
                        updateGameTotalScore: () => { this.calculateGameTotalScore("team2") }
                    }
                };

                this.$scope.$on('$locationChangeStart', ( event ) => {
                    if(this.game.started) {
                        return;
                    }
                    var answer = confirm("Haluatko varmasti poistua sivulta?");
                    if (!answer) {
                        event.preventDefault();
                    }
                });
            }
        }

        public newGameButtonDisabled = () => {

            var team1 = this.game.team1;
            var team2 = this.game.team2;

            if(!this.game.id || !team1 || !team2) {
                return true;
            }

            if(this.game.id.length == 0) {
                return true;
            }

            if(team1 && team2 && (team1 === team2)) {
                this.sameTeamError = true;
                return true;
            } else {
                this.sameTeamError = false;
            }
            return false;
        };

        public startGame = () => {
            this.game.started = true;
            var start = new Date();
            this.game.start = start.toJSON();

            this.NewGameService.sendEvent(this.game, "game_start");

            this.saveGameState();
        };

        public startGameWithCustomTeams = () => {

            if(!this.game.team1.name) {
                var team1id:any = this.game.team1;
                this.game.team1 = {
                    id: team1id,
                    name: this.team1name
                };
            }

            if(!this.game.team2.name) {
                var team2id:any = this.game.team2;
                this.game.team2 = {
                    id: team2id,
                    name: this.team2name
                };
            }

            this.startGame();
        };

        public newModifiedGameButtonDisabled = () => {
            //check whether team is manually entered
            if( (!this.game.team1.id && !this.team1name) || (!this.game.team2.name && !this.team2name) ) {
                return true;
            }
            if(this.game.team1 === this.game.team2) {
                this.sameTeamError = true;
                return true;
            } else {
                this.sameTeamError = false;
            }
            return false;
        };

        //calculates the totalscore of a half game for a team
        public calculateScore = (teamScore:interfaces.GameHalfScoreInterface) => {
            if(!teamScore) {
                return;
            }
            var akkas = teamScore.akkas || 0;
            var pappis = teamScore.pappis || 0;
            var totalScore = (akkas * -2) + (pappis * -1);
            teamScore.totalScore = totalScore;

            teamScore.updateGameTotalScore();

        };

        public makeHalfReady = (halfNumber: number) => {
            if(halfNumber === 1) {
                this.firstHalf.ready = true;
                $('html, body').animate({scrollTop : 0},400);
                this.NewGameService.sendEvent(this.game, "game_1st");
            } else if(halfNumber === 2) {
                this.NewGameService.sendEvent(this.game, "game_2nd");
                this.secondHalf.ready = true;
                $('html, body').animate({scrollTop : 0},400);
            } else if(halfNumber === 3) {
                this.NewGameService.sendEvent(this.game, "game_ot");
                this.overtime.ready = true;
            }

            this.clearGameState();
            this.saveGameState();
        };

        public makeHalfEditable = (halfNumber: number) => {
            if(halfNumber === 1) {
                this.firstHalf.ready = false;
            } else if(halfNumber === 2) {
                this.secondHalf.ready = false;
            } else if(halfNumber === 3) {
                this.overtime.ready = false;
            }
        };

        public checkDraw = () => {
            var team1score = this.game.team1score || 0;
            var team2score = this.game.team2score || 0;
            if(team1score === team2score) {
                return true;
            } else {
                return false;
            }
        };

        public getResultClass = (team) => {

            var team1score = this.game.team1score || 0;
            var team2score = this.game.team2score || 0;
            var winner = "";
            if(team1score === team2score) {
                return "game__result-draw";
            }
            if(team1score > team2score) {
                winner = "team1";
            }
            if(team1score < team2score) {
                winner = "team2";
            }

            if(team == winner) {
                return "game__result-winner";
            } else {
                return "game__result-loser";
            }
        };

        public finishGame = () => {

            this.sendingResults = true;

            this.$timeout(() => {
                this.sendingResults = false;
                //this.game.ready = true;
                this.NewGameService.sendEvent(this.game, "game_end")
                    .then((data) => {
                        this.game.ready = true;
                        this.sendResultsFailed = false;
                        this.savePastGame();
                        this.clearGameState();
                    },
                    (err) => {
                        this.game.ready = true;
                        this.sendResultsFailed = true;
                        this.clearGameState();
                    });
            },1500);
        };

        public finishOvertime = () => {
            this.sendingResults = true;

            this.$timeout(() => {
                this.sendingResults = false;
                //this.overtime.ready = true;
                //this.game.ready = true;
                //this.savePastGame();
                //this.clearGameState();

                this.NewGameService.sendEvent(this.game, "game_ot")
                    .then((data) => {
                        console.log(data);
                        this.overtime.ready = true;
                        this.game.ready = true;
                        this.sendResultsFailed = false;
                        this.savePastGame();
                        this.clearGameState();
                    },
                    (err) => {
                        console.log(err);
                        this.game.ready = true;
                        this.overtime.ready = true;
                        this.sendResultsFailed = true;
                        this.clearGameState();
                    });

            },1500);
        };

        public getWinnerTeamName = () => {

            var team1score = this.game.team1score || 0;
            var team2score = this.game.team2score || 0;

            if(team1score > team2score) {
                return this.game.team1.name;
            }
            if(team1score < team2score) {
                return this.game.team2.name;
            }
            return "";
        };

        public cancelGame = () => {
            var r = confirm("Haulatko varma keskeyttää pelin?");
            if (r == true) {
                this.NewGameService.sendEvent(this.game, "game_cancel");
                this.LocalStorageService.remove('unfinishedgame');
                this.$state.go('home');
            }
        };

        private calculateGameTotalScore = (team) => {
            if(team == "team1") {
                var firstHalfScore = this.firstHalf.team1score.totalScore || 0;
                var secondHalfScore = this.secondHalf.team1score.totalScore || 0;
                var overtimeScore =  this.overtime.team1score.totalScore || 0;
                this.game.team1score = firstHalfScore + secondHalfScore + overtimeScore;
            } else if(team == "team2") {
                var firstHalfScore = this.firstHalf.team2score.totalScore || 0;
                var secondHalfScore = this.secondHalf.team2score.totalScore || 0;
                var overtimeScore =  this.overtime.team2score.totalScore || 0;
                this.game.team2score = firstHalfScore + secondHalfScore + overtimeScore;
            }
        };

        private saveGameState = () => {
            var values = {
                game: this.game,
                firstHalf: this.firstHalf,
                secondHalf: this.secondHalf,
                overtime: this.overtime
            };

            this.LocalStorageService.set('unfinishedgame', values);
        };

        private clearGameState = () => {
            this.LocalStorageService.remove('unfinishedgame');
        };

        private savePastGame = () => {
            var pastGames = [];
            var pastGamesObj:any = this.LocalStorageService.get('pastGames');

            if(pastGamesObj && pastGamesObj.games) {
                pastGames = pastGamesObj.games;
            }
            pastGames.push(this.game);

            var value = { games : pastGames};

            this.LocalStorageService.remove('pastGames');
            this.LocalStorageService.set('pastGames', value);
        };

    }

    var app = angular.module('tissi');
    app.controller('NewGameController', NewGameController);
};