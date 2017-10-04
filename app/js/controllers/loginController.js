'use strict'
/*global angular*/

angular.module('licentaModule')
    .controller('loginController', ['$scope', '$http', '$stateParams', '$state', '$cookies',
        function($scope, $http, $stateParams, $state, $cookies) {

            const SERVER = 'https://licenta-mrnobody22.c9users.io'

            $scope.login = function() {
                if (angular.equals($scope.tipUser, "student")) {
                    var data = {
                        sName: $scope.student.sName,
                        sPassword: $scope.student.sPassword
                    }
                    $http({
                            method: "POST",
                            url: SERVER + "/login_student",
                            data: data
                        })
                        .then(function(response) {
                            $cookies.put("idStudent", response.data)
                            $state.go('home')
                        }, function(response) {
                            console.log(response)
                            $state.go($state.current, {}, {
                                reload: true
                            })
                        })
                }
                else {
                    if (angular.equals($scope.tipUser, "profesor")) {
                        var data1 = {
                            pName: $scope.student.sName,
                            pPassword: $scope.student.sPassword
                        }
                        $http({
                                method: "POST",
                                url: SERVER + "/login_profesor",
                                data: data1
                            })
                            .then(function(response) {
                                var responseDataa = response.data;
                                $http.get(SERVER + '/professors/get_acceptat/' + response.data)
                                    .then((res) => {
                                        console.log(res.data.pAcceptat)
                                        if (res.data.pAcceptat == true) {
                                            $cookies.put("idProfessor", responseDataa)
                                            $state.go('home')
                                        }
                                        else{
                                            alert("Contul nu exista sau nu a fost acceptat")
                                        }
                                    })
                            }, function(response) {
                                $state.go($state.current, {}, {
                                    reload: true
                                })
                            })
                    }
                    else {
                        alert("Please select Student/Professor!")
                    }
                }
            }
            $scope.registerLogin = function() {
                $state.go('register')
            }
        }
    ])
