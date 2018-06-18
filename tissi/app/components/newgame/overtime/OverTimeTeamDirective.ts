/// <reference path="../../../shared/references.ts"/>
module tissi {
    'use strict';

    class OvertimeTeam {
        restrict = "EA";
        require = "";
        templateUrl = '/partials/tissi/overtimeTeamView.html';
        replace = true;
        scope = {
            ngModel: '=',
            formName: '=',
            score: '=',
            locked: "=",
            calculateScore: '&',
            teamName: '='
        };

        constructor(private NewGameService: any) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, ngModel) => {

        };

        static factory(): any {
            var directive = (NewGameService: any) => new OvertimeTeam(NewGameService);
            directive.$inject = ['NewGameService'];
            return directive;
        }
    }

    var app = angular.module('tissi');
    app.directive('overtimeTeam', OvertimeTeam.factory());
}

