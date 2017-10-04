'use strict'
/*global angular*/

angular.module('licentaModule')
    .controller('registerController', ['$scope', '$http', '$stateParams', '$state', '$cookies', function($scope, $http, $stateParams, $state, $cookies) {

        const SERVER = 'https://licenta-mrnobody22.c9users.io'
        $scope.register = (user) => {
            if (angular.equals($scope.tipUser, "student")) {
                $http.post(SERVER + '/register_student', user)
                    .then((response) => {
                        $state.go('login')
                    })
            }
            else {
                if (angular.equals($scope.tipUser, "profesor")) {
                    var profesor = {
                        pName: user.sName,
                        pPassword: user.sPassword,
                        pEmail: user.sEmail
                    }
                    console.log(profesor.pName)
                    $http.get('/professors/getProfessor/' + profesor.pName)
                        .then((response) => {
                            if (response.data == true) {
                                ("Acest nume deja exista!")
                            }
                            else {
                                $http.post(SERVER + '/register_profesor', profesor)
                                    .then(() => {
                                        $state.go('login')
                                    })
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
                else {
                    alert("Selectati Student sau Profesor");
                }
            }
        }
        $scope.cancel = () => {
            $state.go('login');
        }

    }]);
