'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('addCourseController', ['$scope', '$http', '$stateParams', '$state', '$cookies', function($scope, $http, $stateParams, $state, $cookies) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    let $constructor = () => {
        Date.prototype.toDateInputValue = (function() {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        $scope.course = {}
        $scope.course.cBeginDate = new Date(new Date().toDateInputValue())
        $scope.course.cEndDate = new Date(new Date().toDateInputValue())
    }
    $constructor()

    $scope.addCourse = (course) => {
        $http.post(SERVER + '/courses', course)
            .then((response) => {
                var variabila = {
                    idProfessor: parseInt($cookies.get("idProfessor")),
                    idCourse: response.data.id
                }
                $http.post(SERVER + '/course_professors', variabila)
                    .then(() => {})
                    .catch((error) => {
                        console.warn(error)
                    })
            })
            .then(() => {
                $state.go('courses');
            })
            .catch((error) => {
                console.warn(error)
            })

    }
    $scope.cancel = () => {
        $state.go('courses');
    }
}])
