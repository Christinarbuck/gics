var app = angular.module('gics', ['ngRoute']);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/views/home.html"
    })
    .when("/about", {
        templateUrl : "/views/about.html"
    })
    .when("/photos", {
        templateUrl : "/views/photos.html"
    })
    .when("/events", {
        templateUrl : "/views/events.html",
    })

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

});

app.controller('layoutController', function($scope, $http) {

});
