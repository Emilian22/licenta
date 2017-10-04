'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('cursuriController', ['$scope', '$http', '$stateParams', '$state', '$cookies', function($scope, $http, $stateParams, $state, $cookies) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    if ($cookies.get("idStudent")) {
        $scope.tip = false;
        let $constructor = () => {
            $http.get(SERVER + "/courses")
                .then((response) => {
                    $scope.courses = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        $scope.getInfo = (course) => {
            $http.get('/courseStudents/' + course.id + '/getLegatura/' + parseInt($cookies.get("idStudent")))
                .then((response) => {
                    if (response.data == false) {
                        var studentCourse = {
                            idStudent: parseInt($cookies.get("idStudent")),
                            idCourse: course.id,
                            csAcceptat: false
                        }
                        $http.post(SERVER + "/courseStudents/", studentCourse)
                            .then((response) => {
                                alert("Cererea a fost trimisa!")
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                    else {
                        if (response.data.csAcceptat == false) {
                            alert("Inca nu ati fost acceptat la acest curs!")
                        }
                        else {
                            if (response.data.csAcceptat == true) {
                                $state.go('chapters', {
                                    id: course.id
                                })
                            }
                        }
                    }
                })
        }

        $constructor();
    }
    else {
        if ($cookies.get("idProfessor")) {
            $scope.tip = true;
            let $constructor = () => {
                $http.get(SERVER + "/courses")
                    .then((response) => {
                        $scope.courses = response.data
                        $http.get('/myProfile/courses/' + parseInt($cookies.get('idProfessor')))
                            .then((response) => {
                                $scope.courseProfessors = response.data
                                $scope.afisare = (course) => {
                                    for (var i = 0; i < $scope.courseProfessors.length; i++) {
                                        if ($scope.courseProfessors[i].id == course.id) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                            })
                            .catch((error) => {
                                console.warn(error)
                            })

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            $constructor()

            $scope.getInfo = (course) => {
                $state.go('chapters', {
                    id: course.id
                })

            }
        }
        else {
            alert("Logheaza-te, man!")
            $state.go("login")
        }
    }

    $scope.adaugaCurs = () => {
        $state.go('addCourse')
    }
    $scope.dataCurs = (course) => {
        var d = new Date(new Date().toDateInputValue()).toISOString();
        if ((course.cBeginDate <= d) && (d <= course.cEndDate)) {
            return true;
        }
        else {
            return false;
        }
    }
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    });
}])
