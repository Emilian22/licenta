'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('editCourseController', ['$scope', '$http', '$stateParams', '$state', '$cookies', '$window', function($scope, $http, $stateParams, $state, $cookies, $window) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    let $constructor = () => {

        $http.get(SERVER + "/courses/" + $stateParams.id)
            .then((response) => {
                $scope.course = response.data
                console.warn(response.data)
                $scope.course.cBeginDate = new Date(new Date($scope.course.cBeginDate).toDateInputValue())
                $scope.course.cEndDate = new Date(new Date($scope.course.cEndDate).toDateInputValue())
            })
        $scope.cancel = () => {
            $window.history.back()
        }
        $scope.saveCourse = (course) => {
            $http.put(SERVER + '/courses/' + course.id, course)
                .then((response) => {
                    $window.history.back()
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    $constructor()
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    });

}])
