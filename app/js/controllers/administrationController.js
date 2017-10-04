'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('administrationController', ['$scope', '$http', '$stateParams', '$state', '$cookies','$window', function($scope, $http, $stateParams, $state, $cookies, $window) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    
    $http.get(SERVER + '/administration/professors')
    .then((response)=>{
        $scope.professors=response.data;
    })
    .catch((error)=>{
        console.warn(error)
    })
    $scope.acceptareProfessor=(professor)=>{
        $http.put(SERVER + '/administration/professors/' + professor.id)
        .then(()=>{
            $state.go($state.current,{},{
                reload:true
            })
        })
        .catch((error)=>{
            console.warn(error)
        })
    }
}])