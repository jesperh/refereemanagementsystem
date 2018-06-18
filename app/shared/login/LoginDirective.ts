/// <reference path="../../shared/references.ts"/>
module tuho {
    'use strict';

    class LoginDirective {
        restrict = "EA";
        require = "";
        template = '<li><a ng-show="!login.loggedin()"  href="" ng-click="login.open()">Kirjaudu sisään</a><a href="" ng-show="login.loggedin()" ng-click="login.logout()">Kirjaudu ulos</a></li>';
        controller = "LoginController";
        controllerAs = "login";
        replace = true;
        scope = {
            ngModel: '='
        }

        constructor(private MainService: any) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, ngModel) => {
        }

        static factory(): any {
            var directive = (MainService: any) => new LoginDirective(MainService);
            directive.$inject = ['MainService'];
            return directive;
        }
    }

    var app = angular.module('tuho');
    app.directive('login', LoginDirective.factory());
}

module tuho {
    'use strict';

    class PlainLoginDirective {
        restrict = "EA";
        require = "";
        template = '<span><a ng-show="!login.loggedin()"  href="" ng-click="login.open()">Kirjaudu sisään</a><a href="" ng-show="login.loggedin()" ng-click="login.logout()">Kirjaudu ulos</a></span>';
        controller = "LoginController";
        controllerAs = "login";
        replace = true;
        scope = {
            ngModel: '='
        }

        constructor(private MainService: any) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, ngModel) => {
        }

        static factory(): any {
            var directive = (MainService: any) => new PlainLoginDirective(MainService);
            directive.$inject = ['MainService'];
            return directive;
        }
    }

    var app = angular.module('tuho');
    app.directive('loginPlain', PlainLoginDirective.factory());
}
