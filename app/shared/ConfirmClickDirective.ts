/// <reference path="../shared/references.ts"/>
module tuho {
    'use strict';

    class ConfirmClickDirective implements ng.IDirective {

        restrict = 'A';
        priority = -1;

        constructor() {

        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any, ctrl: any, ngModel) => {
            element.bind('click', function (e) {
                var message = attrs.confirmClick;
                if (message && !confirm(message)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            });
        }

        static factory(): ng.IDirectiveFactory {
            var directive = () => new ConfirmClickDirective();
            directive.$inject = [];
            return directive;
        }
    }

    var app = angular.module('tuho');
    app.directive('confirmClick', ConfirmClickDirective.factory());
}
