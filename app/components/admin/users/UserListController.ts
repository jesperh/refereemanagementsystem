module tuho.admin.controllers {
    'use strict';

    export interface UsersControllerInterface {
    }

    export class UsersController {

        static $inject = [
            "AdminService",
            "users",
            "RefereesService",
            "$uibModal",
            "$filter"
        ];

        private usersList: any;
        public sortType: string;
        public sortReverse: boolean;

        constructor(private AdminService: any, users: any, private RefereesService: admin.services.RefereeServiceInterface,  private $uibModal: angular.ui.bootstrap.IModalService, private filter: ng.IFilterService) {
            this.usersList = users.data;
            this.sortType = "firstname";
            this.sortReverse = false;
        }

        openInModal(user) {
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'partials/usersDetails.html',
                controller: 'UserDetailsController',
                controllerAs: "ud",
                resolve: {
                    data: () => {
                        return user;
                    }
                }
            });

            modalInstance.result.then((result) => {
                if (result == true) {
                } else {
                }

            }, () => {
                console.log("not logged.in");
            });
        }

        makeReferee = (user: interfaces.User) => {

            if (!user || !user.id) {
                alert("Ei käyttäjää.");
            }

            this.RefereesService.makeReferee(user.id)
                .then(function (data) {
                    alert("tuomaroitu");
                })
                .catch(function (err) {
                    console.log(err);
                    if (err.status == 409 && err.data == "AlreadyReferee") {
                        alert("Käyttäjä on jo tuomari.")
                    } else {
                        alert("Tuntematon virhe")
                    }
                })
        }

        isReferee = (user: interfaces.User) => {
            if (user.WorkerTournaments && user.WorkerTournaments.length > 0 && user.WorkerTournaments[0].Worker) {
                return true;
            }
            return false;

        }
    }

    var app = angular.module('tuho');
    app.controller('UsersController', UsersController);

    export class UserDetailsController {

        static $inject = [
            "$modalInstance",
            "data"
        ];

        private user;

        constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    data) {
            this.user = data;
        }

        ok() {
            this.$modalInstance.dismiss('cancel');
        }
    }

    var app = angular.module('tuho');
    app.controller('UserDetailsController', UserDetailsController);
}
;

