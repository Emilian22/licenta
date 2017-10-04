'use strict'
/*global angular*/
angular.module('licentaModule')
    .controller('quizController', ['$scope', '$http', '$stateParams', '$state', '$cookies', '$window', function($scope, $http, $stateParams, $state, $cookies, $window) {

        const SERVER = 'https://licenta-mrnobody22.c9users.io'

        let $constructor = () => {
            if ($cookies.get("idStudent")) {
                $scope.tipUtilizator = false;
            }
            else {
                if ($cookies.get("idProfessor")) {
                    $scope.tipUtilizator = true;
                }
            }
            $scope.tip = false;
        }
        $constructor();
        $scope.schimba = () => {
            if ($scope.tip == false) {
                $scope.tip = true;
            }
            else {
                $scope.tip = false;
            }
        }
        $http.get(SERVER + "/quiz/" + $stateParams.id + "/questions")
            .then((response) => {
                $scope.questionss = response.data
                var i = 0;
                firstExecutedFunction(i, function secondExecutedFunction(i) {
                    i++;
                    if (i < $scope.questionss.length) firstExecutedFunction(i, secondExecutedFunction)
                })
            })
        $scope.raspuns = (question) => {
            for (var i = 0; i < question.answers.length; i++) {
                if (question.answers[i].answered == true) {
                    return false;
                }
            }
            return true;
        }

        function firstExecutedFunction(i, callback) {
            $http.get(SERVER + "/question/" + $scope.questionss[i].id + "/answers")
                .then((res) => {
                    $scope.questionss[i].answers = res.data
                })
                .catch((error) => {
                    console.log(error)
                })
            callback(i);
        }
        var test = 0;
        $scope.arataAnswer = (answer) => {
            if (answer.aTip == true) {
                test++;
            }
            answer.answered = true;

        }
        $scope.addQuestion = (question, answers, correctAnswer) => {
            answers[correctAnswer].aTip = true;
            $http.post(SERVER + "/quiz/" + $stateParams.id + "/questions", question)
                .then((response) => {
                    $http.post(SERVER + "/question/" + response.data.id + "/answers", answers[0]);
                    $http.post(SERVER + "/question/" + response.data.id + "/answers", answers[1]);
                    $http.post(SERVER + "/question/" + response.data.id + "/answers", answers[2]);
                    $http.post(SERVER + "/question/" + response.data.id + "/answers", answers[3]);
                })
                .then(() => {
                    $state.go($state.current, {}, {
                        reload: true
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        $scope.nota = () => {
            test = (test / $scope.questionss.length) * 10
            var dateLegatura = {
                idCourse: $stateParams.id,
                idStudent: $cookies.get("idStudent"),
                nota: test
            }
            $http.put(SERVER + "/courseStudents/", dateLegatura)
                .then(() => {
                    $window.history.back()
                })
                .catch((error) => {
                    console.log(error)
                })

        }
        $scope.stergeIntrebare = (question) => {
            $http.delete(SERVER + "/question/" + question.id)
                .then(() => {
                    $state.go($state.current, {}, {
                        reload: true
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }])
