'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('gestionareCereriController', ['$scope', '$http', '$stateParams', '$state', '$cookies', '$window', 'Upload', function($scope, $http, $stateParams, $state, $cookies, $window, Upload) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    $scope.gasit = -1;
    $http.get(SERVER + "/myProfile/studentCourses/" + $stateParams.id)
        .then((response) => {
            if (response.data.length == 0) {
                $scope.gasit = false

            }
            else {
                $scope.gasit = true
                $scope.links = response.data
            }
        })
        .catch((error) => {
            console.warn(error)
        })
    $scope.acceptaCerere = (link) => {
        var dateLegatura = {
            idCourse: $stateParams.id,
            idStudent: link.idStudent
        }
        $http.put(SERVER + "/course_students/", dateLegatura)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    $scope.stergeCerere = (link) => {
        $http.delete(SERVER + "/course_students/"+$stateParams.id+"/"+link.idStudent)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
}])
