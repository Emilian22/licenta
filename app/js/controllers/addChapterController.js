'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('addChapterController', ['$scope', '$http', '$stateParams', '$state', '$cookies', '$window','Upload', function($scope, $http, $stateParams, $state, $cookies, $window,Upload) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    $scope.cancel = () => {
       $window.history.back()
    }
    $scope.addChapter = (chapter) => {
        console.log(chapter.chBlob)
             $http.post(SERVER + '/courses/' + $stateParams.id + '/chapters' , chapter)
             .then((response)=>{
                 $window.history.back()
             })
             .catch((error)=>{
                 console.warn(error)
             })
    }
}])
