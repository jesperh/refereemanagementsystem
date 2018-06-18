/// <reference path="../../../shared/references.ts"/>
module tissi {
    'use strict';

    class HalfGameTeam {
        restrict = "EA";
        require = "";
        templateUrl = '/partials/tissi/halfGameTeamView.html';
        replace = true;
        scope = {
            ngModel: '=',
            formName: '=',
            score: '=',
            locked: "=",
            calculateScore: '&',
            teamName: '=',
            vm: '='
        };

        constructor(private NewGameService: any) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, ngModel) => {

        };

        static factory(): any {
            var directive = (NewGameService: any) => new HalfGameTeam(NewGameService);
            directive.$inject = ['NewGameService'];
            return directive;
        }
    }

    var app = angular.module('tissi');
    app.directive('halfGameTeam', HalfGameTeam.factory());
}

