/// <reference path="../../../shared/references.ts"/>
module tuho {
    'use strict';

    class CourtMessageDirective {
        restrict = "EA";
        require = "";
        template = '<h1>Moro</h1>';
        replace = true;
        scope = {
            ngModel:'='
        };
        constructor() {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, ngModel) => {
        };

        static factory(): any {
            var directive = (MainService: any) => new CourtMessageDirective();
            directive.$inject = [];
            return directive;
        }
    }

    var app = angular.module('tuho');
    app.directive('court-message', CourtMessageDirective.factory());
}