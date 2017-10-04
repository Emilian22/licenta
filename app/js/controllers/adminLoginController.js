'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('adminLoginController', ['$scope', '$http', '$stateParams', '$state', '$cookies','$window', function($scope, $http, $stateParams, $state, $cookies, $window) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    
    $scope.login=(admin)=>{
        $http.post(SERVER + '/admin',admin)
        .then((response)=>{
            $cookies.put("idAdmin",response.data)
            $state.go('home')
        })
        .catch((error)=>{
            console.warn(error)
        })
    }
}])