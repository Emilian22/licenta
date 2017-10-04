'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('editChapterController', ['$scope', '$http', '$stateParams', '$state', '$cookies','$window', function($scope, $http, $stateParams, $state, $cookies,$window) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    
    $http.get('/chaptersEdit/'+$stateParams.id)
    .then((response)=>{
        $scope.chapter=response.data
    })
    $scope.cancel=()=>{
        $window.history.back()
    }
    $scope.saveChapter=(chapter)=>{
         $http.put(SERVER + '/chaptersEdit/' + chapter.id,chapter)
        .then((response)=>{
            $window.history.back()
        })
        .catch((error)=>{
            console.log(error)
        })
    }
}])