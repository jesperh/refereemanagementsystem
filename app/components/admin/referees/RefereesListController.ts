module tuho.admin.controllers {
    'use strict';

    export class RefereesListController {

        static $inject = [
            "RefereesService",
            "referees",
            "CourtsService",
            "courts",
            "$uibModal",
            "REFEREESTATUSES",
            "$timeout",
            "$filter",
            "POWERBANKSTATUSES",
            "PAWNSTATUSES"
        ];

        public refereesList: interfaces.Referee[];
        public courtsList: interfaces.Court[];
        public emptyCourtsList: interfaces.Court[];
        public sortType: string;
        public sortReverse: boolean;

        constructor(private RefereesService: admin.services.RefereesService, referees: any, private CourtsService: admin.services.CourtsServiceInterface, private courts: any, private $uibModal: angular.ui.bootstrap.IModalService, public refereeStatuses, private $timeout: ng.ITimeoutService, private $filter: ng.IFilterService, public powerbankStatuses, public pawnStatuses) {
            this.refereesList = referees.data;

            this.courtsList = courts.data;
            this.emptyCourtsList = this.CourtsService.courtsWithoutReferee(courts.data, this.refereesList);
            this.sortType = "Worker.User.firstname";
            this.sortReverse = false;
        }

        addRefereeCourt = (referee, court, flags) => {
            if (!referee || !court) {
                alert("virheelliset parametrit!");
                return;
            }

            var courtId;

            if (angular.isObject(court)) {
                courtId = court.id;
            } else if (angular.isString(court)) {
                var c: any = this.findCourtByNumber(parseInt(court));
                if (c != null) {
                    courtId = c.id;
                } else {
                    alert("Kenttää ei löytynyt");
                    return;
                }
            } else if (angular.isNumber(court)) {
                var c: any = this.findCourtByNumber(court);
                if (c != null) {
                    courtId = c.id;
                } else {
                    alert("Kenttää ei löytynyt");
                    return;
                }
            } else {
                alert("Kenttää ei tunnistettu");
                return;
            }

            this.RefereesService.addRefereeCourt(referee.id, courtId)
                .then(() => {
                    var index = _.findIndex(this.emptyCourtsList, function (court) {
                        return court.id == parseInt(courtId);
                    });

                    referee.CourtId = courtId;
                    referee.Court = this.findCourtById(courtId);

                    this.emptyCourtsList.splice(index, 1);
                    flags.editable = false;
                })
                .catch(function (err) {
                    if (err.status == 404 && err.data.error == "CourtNotFound") {
                        alert("Kenttää ei löytynyt");
                    }
                    if (err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                });
        };

        removeRefereeCourt = (referee: interfaces.Referee, courtId: number) => {
            if (!referee || !courtId) {
                alert("Virheelliset parametrit");
                return;
            }
            this.RefereesService.removeRefereeCourt(referee.id, courtId)
                .then((court) => {
                    referee.CourtId = undefined;
                    referee.Court = undefined;
                    this.updateEmptyCourts();
                })
                .catch(function (err) {
                    if (err.status == 404) {
                        if (err.data.error == "CourtNotFound") {
                            alert("Kenttää ei löytynyt");
                        }
                        if (err.data.error == "RefereeNotFound") {
                            alert("Tuomaria ei löytynyt");
                        }
                    } else {
                        alert("Palvelin virhe");
                    }
                });
        };

        setRefereeStatus = (refereeId, status, show) => {
            this.RefereesService.setRefereeStatus(refereeId, status)
                .then((referee) => {
                    show.success = true;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                })
                .catch(function (err) {
                    show.success = false;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                    if (err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Kenttää ei löytynyt");
                    }
                    if (err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                });
        };

        setPowerbank = (refereeId, status, show) => {
            this.RefereesService.setPowerbank(refereeId, status)
                .then((referee) => {
                    show.success = true;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                })
                .catch((err) => {
                    show.success = false;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                    if (err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Statusta ei löytynyt");
                    }
                    if (err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                });
        };

        setPawn = (refereeId, status, show) => {
            this.RefereesService.setPawn(refereeId, status)
                .then((referee) => {
                    show.success = true;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                })
                .catch((err) => {
                    show.success = false;
                    this.$timeout(() => {
                        show.success = undefined;
                    }, 2000);

                    if (err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Statusta ei löytynyt");
                    }
                    if (err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                });
        };

        inverseEditable = (flags) => {
            if (!flags.editable) {
                flags.editable = true;
                return;
            }
            flags.editable = false;
            return;
        };

        removeReferee = (referee: interfaces.Referee) => {
            if (!referee || !referee.id) {
                alert("Virheellinen tuomari");
                return;
            }
            this.RefereesService.removeReferee(referee.id)
                .then((data) => {
                    var indx = _.findIndex(this.refereesList, (refereeIter) => {
                        return referee.id === refereeIter.id;
                    });
                    if (indx > -1) {
                        this.refereesList.splice(indx, 1);
                        this.updateEmptyCourts();
                    }
                })
                .catch(function (err) {
                    alert("Tuomarin poisto epäonnistui");
                });
        };

        openInModal(user) {

            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'partials/refereesDetails.html',
                controller: 'RefereeDetailsController',
                controllerAs: "rd",
                //size: size,
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
                console.log("modal cancel");
            });
        }

        private updateEmptyCourts = () => {
            this.emptyCourtsList = this.CourtsService.courtsWithoutReferee(this.courtsList, this.refereesList);
        }

        private findCourtByNumber = (number) => {
            return _.find(this.courtsList, (court) => {
                return court.number === number;
            });
        }

        private findCourtById = (id) => {
            return _.find(this.courtsList, (court) => {
                return court.id === id;
            });
        }
    }

    var app = angular.module('tuho');
    app.controller('RefereesListController', RefereesListController);

    export class RefereeDetailsController {

        static $inject = [
            "$modalInstance",
            "data"
        ];

        private referee;

        constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    data) {
            this.referee = data;
        }

        ok() {
            this.$modalInstance.dismiss('cancel');
        }
    }

    var app = angular.module('tuho');
    app.controller('RefereeDetailsController', RefereeDetailsController);
}
;

