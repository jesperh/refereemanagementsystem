module tuho.admin.controllers {
    'use strict';

    export class MapController {

        static $inject = [
            "CourtsService",
            "courts",
            "RefereesService",
            "referees",
            "$scope",
            "MapService",
            "$compile",
            "REFEREESTATUSES",
            "POWERBANKSTATUSES",
            "PAWNSTATUSES",
            "$timeout"
        ];

        private courtsList: any;
        private refereesList: any;

        constructor(private CourtsService: any, public courts: any, private RefereesService, private referees, private $scope, private MapsService: admin.services.MapService, private $compile, public refereeStatuses, public powerbankStatuses, public pawnStatuses, private $timeout:ng.ITimeoutService) {

            this.courtsList = courts.data;
            this.refereesList = _.map(referees.data, function (element) {
                return _.extend({}, element, {fullname: element.Worker.User.lastname + ", " + element.Worker.User.firstname});
            });

            var courtsMapData = this.getCourts();
            var markers = courtsMapData.markers;
            var paths = courtsMapData.paths;

            $scope.removeMarkers = function () {
                $scope.markers = {};
            };

            angular.extend($scope, {
                defaults: {},
                center: {
                    lat: 61.4501761,
                    lng: 23.861271699999975,
                    zoom: 16
                },
                markers: markers,
                paths: paths
            });
        }

        public findRefereeCourt = (referee: interfaces.Referee) => {
            if (!referee) {
                var markers = this.getCourts().markers;
                this.$scope.markers = markers;
            }

            var index = this.findReferee(referee);
            if (index == -1) {
                alert("Tuomari ei ole kentällä.")
            }

            var court = this.courtsList[index];
            var marker = this.$scope.markers["court" + court.number];

            this.$scope.markers = [marker];
            this.$scope.center = {
                lat: marker.lat,
                lng: marker.lng,
                zoom: 18
            }
        };

        public clearSelectedReferee = (referee: interfaces.Referee) => {
            if (!angular.isObject(referee) || !referee.id) {
                var markers = this.getCourts().markers;
                this.$scope.markers = markers;
            }
        }

        public addRefereeToCourt = (referee, courtId, pawnStatus, refereeStatus, powerbankStatus) => {

            var indx = this.findReferee(referee);

            if (indx > -1) {
                alert("Tuomari on jo toisella kentällä");
                return;
            }

            this.RefereesService.addRefereeCourt(referee.id, courtId)
                .then((refereeData) => {

                    var index = _.findIndex(this.courtsList, function (court) {
                        return court.id == parseInt(courtId);
                    });

                    if (index != -1) {
                        this.courtsList[index].Referees.push(referee);
                        var markers = this.getCourts().markers;
                        this.$scope.markers = markers;

                    } else {
                        alert("Karttan päivitys epäonnistui");
                    }

                    if(refereeStatus) this.setRefereeStatus(referee.id, refereeStatus)
                    if(pawnStatus) this.setPawn(referee.id, pawnStatus);
                    if(powerbankStatus) this.setPowerbank(referee.id, powerbankStatus);
                })
                .catch(function(err){
                    if(err.status == 404 && err.data.error == "CourtNotFound") {
                        alert("Kenttää ei löytynyt");
                    }
                    if(err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                    console.log(err)
                });

        };

        public setRefereeStatus = (refereeId, status) => {
            this.RefereesService.setRefereeStatus(refereeId, status)
                .then((referee) => {
                    console.log("succesfully set status for referee" + refereeId);
                })
                .catch(function(err) {
                    if(err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Kenttää ei löytynyt");
                    }
                    if(err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                    console.log(err)
                });
        };

        public setPowerbank = (refereeId, status) => {
            this.RefereesService.setPowerbank(refereeId, status)
                .then((referee) => {
                    console.log("succesfully set power bank for referee" + refereeId);
                })
                .catch((err) => {
                    if(err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Statusta ei löytynyt");
                    }
                    if(err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                    console.log(err)
                });
        };

        public setPawn = (refereeId, status) => {
            this.RefereesService.setPawn(refereeId, status)
                .then((referee) => {
                    console.log("Pawn set for referee " + refereeId)})
                .catch((err) => {
                        console.error("Failed set pawn for referee " + refereeId);
                        console.log(err);
                    if(err.status == 404 && err.data.error == "StatusNotFound") {
                        alert("Statusta ei löytynyt");
                    }
                    if (err.status == 404 && err.data.error == "RefereeNotFound") {
                        alert("Tuomaria ei löytynyt");
                    }
                });
        };

        private getCourts() {

            var paths = {};
            var markers = {};

            _.forEach(this.courtsList, (court) => {

                var path = this.MapsService.courtCoordinates(court.angle, court.latitude, court.longitude);
                var key = "court" + court.number;
                paths[key] = {
                    type: "polygon",
                    latlngs: path,
                    color: this.getColor(),
                    weight: 2,
                    compileMessage: true,
                };

                var center = this.MapsService.courtCenterCoordinates(path);

                markers[key] = {
                    lat: center.lat,
                    lng: center.lng,
                    message: this.getCourtMessage(court),
                    compileMessage: true,
                    getMessageScope: () => {
                        return this.$scope;
                    },
                    focus: false,
                    draggable: false,
                    zIndexOffset: this.getCourtZindex(court),
                    icon: {
                        type: 'div',
                        iconSize: [20, 20],
                        popupAnchor: [0, -10],
                        html: '<div class="leaflet-map-number"><strong>' + court.number + '</strong></div>',
                        className: this.getClassName(court)
                    }
                };
            });
            return {paths: paths, markers: markers};
        }

        private getCourtMessage(court) {

            var msg = "<div class='map-court-message-container' ng-init='court=" + JSON.stringify(court) + "'>";
            msg += "<p class='court-message-heading'>Tuomari:</p>"
            msg += "<p ng-repeat='referee in court.Referees'>{{ referee.Worker.User.lastname }}, {{ referee.Worker.User.firstname }}<p>";
            msg += "<p> </p>";

            msg += "<p class='court-message-heading'>Loppuaika: {{court.endTime | date:'HH:mm'}} </p>";
            msg += "<p> </p>";
            //referee status
            msg += '<div class="input-group input-group-sm">';

            msg += '<select style="" class="form-control" ng-model="refereeStatus" ng-options="status for status in vm.refereeStatuses">';
            msg += '<option value=""> -- Status -- </option>';
            msg += '</select>';

            msg += '</div>';

            //power bank status
            msg += '<div class="input-group input-group-sm">';

            msg += '<select style="" class="form-control" ng-model="powerbankStatus" ng-options="powerbank for powerbank in vm.powerbankStatuses">';
            msg += '<option value=""> -- Virtalähde -- </option>';
            msg += '</select>';

            msg += '</div>';

            //pawn status
            msg += '<div class="input-group input-group-sm">';

            msg += '<select  class="form-control" ng-model="refereePawn" ng-options="pawn for pawn in vm.pawnStatuses">';
            msg += '<option value=""> -- Pantti -- </option>';
            msg += '</select>';

            msg += '</div>';

            //referee picker
            msg += "<p ng-init='newReferee = undefined' class='court-message-heading'>Lisää tuomari:</p>";
            msg += '<div class="input-group input-group-sm">';
            msg +=     '<input type="text" ng-model="newReferee" uib-typeahead="referee as referee.fullname for referee in vm.refereesList | filter: {fullname: $viewValue} | limitTo:5" typeahead-on-select="model=$item.value" class="form-control">'
            msg +=      '<span class="input-group-btn">';
            msg +=          '<button ng-disabled="!newReferee" ng-click="vm.addRefereeToCourt(newReferee, court.id, refereePawn, refereeStatus, powerbankStatus)" class="btn btn-primary" type="button">Lisää</button>'
            msg +=      '</span>';

            msg += '</div>';
            msg += "<p></p><div>";

            return msg;
        }

        //todo: color by court/referee status
        private getColor() {
            return "#008000"
        }

        //todo: class by court/referee status
        private getClassName(court:interfaces.Court) {
            if(court.Referees.length > 0) {
                return "map-court-circle-referee"
            }
            var endTime = new Date(court.endTime);
            var hours = endTime.getHours();
            var minutes =  endTime.getMinutes();
            console.log(court.number + " : " + hours + " : " + minutes);
            if(hours == 17 && minutes == 40) {
                return "map-court-circle-1740";
            }
            if(hours == 18 && minutes == 25) {
                return "map-court-circle-1825";
            }
            if(hours == 16 && minutes == 55) {
                return "map-court-circle-1655";
            }
            if(hours == 16 && minutes == 10) {
                return "map-court-circle-1610";
            }
            if(hours == 15 && minutes == 25) {
                return "map-court-circle-1525";
            }
            if(hours == 14 && minutes == 40) {
                return "map-court-circle-1440";
            }

            if(hours == 11 && minutes == 55) {
                return "map-court-circle-1155";
            }

            return "map-court-circle-empty";
        }

        private getCourtZindex(court: interfaces.Court) {
            if (court.Referees.length > 0) {
                return 10
            }
            return 30;
        }

        private findReferee = (referee: interfaces.Referee) => {
            return _.findIndex(this.courtsList, function (court: interfaces.Court) {
                if (court.Referees.length > 0) {
                    if (court.Referees[0].id == referee.id) {
                        return true;
                    }
                }
                return false;
            });
        }
    }

    var app = angular.module('tuho');
    app.controller('MapController', MapController);
}
;

