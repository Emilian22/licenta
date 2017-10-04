'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('disconnectController', ['$state', '$cookies', function($state, $cookies) {
    if ($cookies.get("idStudent")) {
        $cookies.remove("idStudent");
    }
    else {
        if ($cookies.get('idProfessor')) {
            $cookies.remove("idProfessor");
        }
        else {
            $cookies.remove('idAdmin');
        }
    }
    $state.go('home');
}])
