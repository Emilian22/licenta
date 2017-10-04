'use strict'
/*global angular*/
const ctrl = angular.module('licentaModule', ['ui.router'])

const SERVER = 'https://licenta-mrnobody22.c9users.io'

ctrl.controller('licentaController', ['$scope', '$http', '$state', '$cookies', "$rootScope", function($scope, $http, $state, $cookies, $rootScope) {
    $scope.data = []
    $scope.data1=[]
    $rootScope.log = true;
    $rootScope.notAdmin = true;
    if ($cookies.get('idStudent')) {
        $http.get(SERVER + "/students/get_name/" + $cookies.get('idStudent'))
            .then((response) => {
                $rootScope.loggedInAs = "You are logged in as " + response.data.sName;
            })
        $rootScope.log = false;
    }
    else {
        if ($cookies.get('idProfessor')) {
            $http.get(SERVER + "/professors/get_name/" + $cookies.get('idProfessor'))
                .then((response) => {
                    $rootScope.loggedInAs = "You are logged in as " + response.data.pName;
                })
            $rootScope.log = false;
        }
        else {
            if ($cookies.get('idAdmin')) {
                $http.get(SERVER + "/admins/get_name/" + $cookies.get('idAdmin'))
                    .then((response) => {
                        $rootScope.loggedInAs = "You are logged in as " + response.data.aName;
                    })
                $rootScope.log = false;
                $rootScope.notAdmin = false;
            }
            else {
                $rootScope.loggedInAs = "You are not logged in!";
            }
        }
    }
    $scope.loggedInAs = $rootScope.loggedInAs;
    let $constructor = () => {
        $http.get(SERVER + "/numberStudents")
            .then((response) => {
                $scope.numarStudenti = response.data
                $scope.data[0] = $scope.numarStudenti[0].count;
            })
            .catch((error) => {
                console.log(error)
            })
        $http.get(SERVER + "/numberProfessors")
            .then((response) => {
                $scope.numarProfesori = response.data
                $scope.data[1] = $scope.numarProfesori[0].count;
            })
            .catch((error) => {
                console.log(error)
            })
        $http.get(SERVER + "/numberCourses")
            .then((response) => {
                $scope.numarCursuri = response.data
            })
            .catch((error) => {
                console.log(error)
            })
        $http.get(SERVER + "/numberActiveCourses")
            .then((response) => {
                $scope.numarCursuriActive = response.data[0].count
                $scope.data1[0]=$scope.numarCursuriActive
            })
            .catch((error) => {
                console.log(error)
            })
        $http.get(SERVER + "/numberInactiveCourses")
            .then((response) => {
                $scope.numarCursuriInactive = response.data[0].count
                $scope.data1[1]=$scope.numarCursuriInactive
            })
            .catch((error) => {
                console.log(error)
            })
    }
    $scope.data[2] = 1;
    $scope.labels = ["Studenti inscrisi", "Profesori inscrisi", "Administrator"];
    $scope.colors = ['#ff0000', '#0000ff', "#00ff00"];
    $scope.labels1=["Cursuri Active","Cursuri Inactive"];
    $scope.colors1=['#00ff00','#ff0000']
    $scope.options={
        legend:{
            display:true,
            position:"bottom"
        }
    }
    $scope.options1={
        legend:{
            display:true,
            position:"bottom"
        }
    }
    $constructor();
}])
