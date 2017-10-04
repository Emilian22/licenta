'use strict'
/*global angular*/

angular.module('licentaModule')
    .controller('myProfileController', ['$scope', '$http', '$stateParams', '$state', '$cookies', function($scope, $http, $stateParams, $state, $cookies) {

        $scope.profCourses = {}
        $scope.data = []
        $scope.note = []
        $scope.data1 = []
        $scope.courseNames = []
        $scope.courseNumber = []
        $scope.options2 = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    type: 'linear',
                    display: true,
                }]
            }
        }
        for (var i = 0; i <= 10; i++) {
            $scope.note[i] = 0;
        }

        const SERVER = 'https://licenta-mrnobody22.c9users.io'

        if ($cookies.get('idStudent')) {
            $scope.tipProfil = false;
            $http.get(SERVER + "/students/get_name/" + $cookies.get('idStudent'))
                .then((response) => {
                    $scope.userName = response.data.sName
                })
                .catch((error) => {
                    console.log(error)
                })
            $http.get(SERVER + "/myProfileS/courses/" + parseInt($cookies.get("idStudent")))
                .then((response) => {
                    $scope.courses = response.data
                    for (var i = 0; i < $scope.courses.length; i++) {
                        if (($scope.courses[i].csGrade >= 0) && ($scope.courses[i].csGrade <= 10)) {
                            $scope.note[$scope.courses[i].csGrade]++;
                        }
                    }
                })
            $scope.labels1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
            $scope.enterCourse = (course) => {
                if (course.csAcceptat == true) {
                    $state.go('chapters', {
                        id: course.id
                    })
                }
                else {
                    alert("Nu ati fost inca acceptat!")
                }
            }

            $scope.acceptatCurs = (course) => {
                if (course.csAcceptat == true) {
                    return true;
                }
                else {
                    return false;
                }
            }
            $scope.courseGrade = (course) => {
                if (course.csGrade != null) {
                    return true;
                }
                return false;
            }
            $http.get("/myProfileS/" + parseInt($cookies.get("idStudent")) + "/CursuriInAsteptare")
                .then((response) => {
                    $scope.cursuriInAsteptare = response.data[0].count
                    $scope.data[2] = $scope.cursuriInAsteptare
                })
                .catch((error) => {
                    console.log(error)
                })
            $http.get("/myProfileS/" + parseInt($cookies.get("idStudent")) + "/CursuriNepromovate")
                .then((response) => {
                    $scope.cursuriNepromovate = response.data[0].count
                    $scope.data[1] = $scope.cursuriNepromovate
                })
                .catch((error) => {
                    console.log(error)
                })
            $http.get("/myProfileS/" + parseInt($cookies.get("idStudent")) + "/CursuriPromovate")
                .then((response) => {
                    $scope.cursuriPromovate = response.data[0].count
                    $scope.data[0] = $scope.cursuriPromovate
                })
                .catch((error) => {
                    console.log(error)
                })
            $http.get("/myProfileS/" + parseInt($cookies.get("idStudent")) + "/CursuriNeterminate")
                .then((response) => {
                    $scope.cursuriNenotate = response.data[0].count
                    $scope.data[3] = $scope.cursuriNenotate
                })
                .catch((error) => {
                    console.log(error)
                })
            $scope.options = {
                legend: {
                    display: true,
                    position: "bottom"
                }
            }
            $scope.labels = ["Promovate", "Nepromovate", "In Asteptare", "Fara Nota"]
            $scope.colors = ["#00FF00", "#FF0000", "#F89406", "#0000FF"]
        }
        else {
            if ($cookies.get('idProfessor')) {
                $scope.tipProfil = true;
                let $constructor = () => {
                    $http.get(SERVER + "/professors/get_name/" + $cookies.get('idProfessor'))
                        .then((response) => {
                            $scope.userName = response.data.pName
                        })
                }
                $http.get(SERVER + "/myProfile/courses/" + parseInt($cookies.get('idProfessor')))
                    .then((response) => {
                        $scope.courses = response.data
                        for (var i = 0; i < $scope.courses.length; i++) {
                            $scope.courseNames[i] = $scope.courses[i].cTitle;

                            $http.get(SERVER + "/myProfile/numberStudents/" + $scope.courses[i].id + "/" + i)
                                .then((res) => {
                                    $scope.courseNumber[res.data.pam] = res.data.count
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    })

                .catch((error) => {
                    console.warn(error)
                })
                $scope.options1 = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
                $constructor();
                $scope.gestionareCereri = (course) => {
                    $state.go('gestionareCereri', {
                        id: course.id
                    })
                }
                $scope.enterCourse = (course) => {
                    $state.go('chapters', {
                        id: course.id
                    })
                }
            }

        }
        $scope.dataCurs = (course) => {
            var g = new Date(new Date().toDateInputValue()).toISOString();
            if ((course.cBeginDate <= g) && (g <= course.cEndDate)) {

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
