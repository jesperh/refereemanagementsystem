/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services
{
    'use strict';

    export interface CourtsServiceInterface {
        addCourt(court): ng.IHttpPromise<any>;
        getCourts(): ng.IHttpPromise<interfaces.Court[]>;
        courtsWithoutReferee(courts:interfaces.Court[], referee:interfaces.Referee[]): interfaces.Court[];
    }

    export class CourtsService implements CourtsServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        constructor(private $http: any, private $log: any)  {
        }

        public addCourt(court) {
            return this.$http.post("/api/admin/courts", court)
        }

        public getCourts(){
            return this.$http.get("/api/admin/courts").then(function(courts){
                return courts;
            }).catch(function(err){
                return err;
            });
        }

        //compares list of courts to list of referees and returns those courts that
        //don't have a referee on them. Note: referee model must have court model included!
        public courtsWithoutReferee(courts:interfaces.Court[], referees:interfaces.Referee[]) {

            //todo: use _.differenceBy -method, when lodash4 is released...

            var courtsList = [];

            _.forEach(courts, function(court){

                var found = false;
                _.forEach(referees, function(referee){
                    if(court.id === referee.CourtId) {
                       found = true;
                    }
                });

                if(!found) {
                    courtsList.push(court);
                }
            });
            return courtsList;
        }
    }

    var module = angular.module('tuho');
    module.service("CourtsService", CourtsService);
}