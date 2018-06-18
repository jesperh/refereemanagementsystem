module tuho.admin.filters {
    'use strict';

    //todo: typescriptify
    var app = angular.module('tuho');

    app.filter('refereeSearch', ['REFEREESTATUSES', function (REFEREESTATUSES) {
        return function (items, term) {
            if (!term) {
                return items;
            }
            return _.filter(items, function (item: interfaces.Referee) {
                return found(item, term, REFEREESTATUSES);
            });
        };
    }]);

    app.filter('isInterested',function () {
        return function (items, usefilter) {

            if(!usefilter) {
                return items;
            }

            return _.filter(items, function(item:any){
                //console.log(item);

                return item.interestedThisYear;


            });
        };
    });

    function found(item:interfaces.Referee, term, REFEREESTATUSES) {

        var lastname = item.Worker.User.lastname.toLowerCase();
        var firstname = item.Worker.User.firstname.toLowerCase();
        var username = item.Worker.User.username.toLowerCase();

        if (common.isNumeric(term)) {
            return item.Court.number == term;
        }

        term = term.toLowerCase();

        var indx = _.findIndex(REFEREESTATUSES, function (status) {
            return term == status.toLowerCase();
        });

        if (indx > -1) {
            if (item.status && item.status.toLowerCase() == term) {
                return true;
            }
        }

        if (lastname.indexOf(term) > -1
            || firstname.indexOf(term) > -1
            || username.indexOf(term) > -1) {
            return true;
        }
    }
}
;

