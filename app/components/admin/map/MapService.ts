/// <reference path="../../../shared/references.ts"/>
module tuho.admin.services {
    'use strict';

    export interface MapServiceInterface {
        courtCoordinates(angle, latitude, longitude): any[];

        courtCenterCoordinates(path: any[]): any;
    }

    interface Coordinate {
        latitude: any;
        longitude: any;
    }

    interface CourtPolygonCoordinate {
        deg?: Coordinate;
        rad?: Coordinate;
    }

    export class MapService implements MapServiceInterface {
        static $inject = [
            "$http",
            "$log"
        ];

        //court height in km
        private courtHeight;
        //court width in km
        private courtWidth;
        //earth radius in km
        private earthRadius;

        constructor(private $http: any, private $log: any) {

            this.courtHeight = 0.02;
            this.courtWidth = 0.005;
            this.earthRadius = 6378.1;

        }

        private toRad = (deg) => {
            return deg * Math.PI / 180;
        }

        private toDeg = (rad) => {
            return rad * 180 / Math.PI;
        }

        public courtCoordinates = (angle, latitude, longitude) => {

            var bearing = this.toRad(angle);
            var rightAngle = this.toRad(angle + 90);


            //***** point 1 ******
            var c1: CourtPolygonCoordinate = {
                deg: {
                    "latitude": latitude,
                    "longitude": longitude
                },
                rad: {
                    "latitude": this.toRad(latitude),
                    "longitude": this.toRad(longitude)
                }
            }

            //***** point 2 ******
            var c2RadLat = Math.asin(Math.sin(c1.rad.latitude) * Math.cos(this.courtWidth / this.earthRadius) + Math.abs(Math.cos(c1.rad.latitude) * Math.sin(this.courtWidth / this.earthRadius) * Math.cos(bearing)));
            var c2RadLon = c1.rad.longitude + Math.atan2(Math.sin(bearing) * Math.sin(this.courtWidth / this.earthRadius) * Math.cos(c1.rad.latitude), Math.cos(this.courtWidth / this.earthRadius) - Math.sin(c1.rad.latitude) * Math.sin(c2RadLat));

            var c2: CourtPolygonCoordinate = {
                rad: {
                    "latitude": c2RadLat,
                    "longitude": c2RadLon
                },
                deg: {
                    latitude: this.toDeg(c2RadLat),
                    longitude: this.toDeg(c2RadLon)
                }
            };

            //***** point 3 ******
            var c3RadLat = Math.asin(Math.sin(c1.rad.latitude) * Math.cos(this.courtHeight / this.earthRadius) + Math.cos(c1.rad.latitude) * Math.sin(this.courtHeight / this.earthRadius) * Math.cos(rightAngle));
            var c3RadLon = c1.rad.longitude + Math.atan2(Math.sin(rightAngle) * Math.sin(this.courtHeight / this.earthRadius) * Math.cos(c1.rad.latitude), Math.cos(this.courtHeight / this.earthRadius) - Math.sin(c1.rad.latitude) * Math.sin(c1.rad.latitude));

            var c3: CourtPolygonCoordinate = {
                rad: {
                    "latitude": c3RadLat,
                    "longitude": c3RadLon
                },
                deg: {
                    latitude: this.toDeg(c3RadLat),
                    longitude: this.toDeg(c3RadLon)
                }
            };

            //***** point 4 ******
            var c4RadLat = Math.asin(Math.sin(c3RadLat) * Math.cos(this.courtWidth / this.earthRadius) + Math.cos(c3RadLat) * Math.sin(this.courtWidth / this.earthRadius) * Math.cos(bearing));
            var c4RadLon = c3RadLon + Math.atan2(Math.sin(bearing) * Math.sin(this.courtWidth / this.earthRadius) * Math.cos(c3RadLat), Math.cos(this.courtWidth / this.earthRadius) - Math.sin(c3RadLat) * Math.sin(c3RadLat));

            var c4: CourtPolygonCoordinate = {
                rad: {
                    "latitude": c4RadLat,
                    "longitude": c4RadLon
                },
                deg: {
                    latitude: this.toDeg(c4RadLat),
                    longitude: this.toDeg(c4RadLon)
                }
            };


            var polygonPath = [
                {lat: parseFloat(c1.deg.latitude), lng: parseFloat(c1.deg.longitude)},
                {lat: parseFloat(c2.deg.latitude), lng: parseFloat(c2.deg.longitude)},
                {lat: parseFloat(c4.deg.latitude), lng: parseFloat(c4.deg.longitude)},
                {lat: parseFloat(c3.deg.latitude), lng: parseFloat(c3.deg.longitude)},
            ];
            return polygonPath;
        }

        public courtCenterCoordinates(path) {
            var lat1 = path[0].lat;
            var lat3 = path[2].lat;
            var lon1 = path[0].lng;
            var lon3 = path[2].lng;

            var latCenter = lat1 + (lat3 - lat1) / 2;
            var lngCenter = lon1 + (lon3 - lon1) / 2;

            return {lat: parseFloat(latCenter), lng: parseFloat(lngCenter)};
        }
    }

    var module = angular.module('tuho');
    module.service("MapService", MapService);
}