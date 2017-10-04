'use strict'
/*global angular*/
angular.module('licentaModule')

.controller('chaptersController', ['$scope', '$http', '$stateParams', '$state', '$cookies', 'Upload', function($scope, $http, $stateParams, $state, $cookies, Upload) {

    const SERVER = 'https://licenta-mrnobody22.c9users.io'
    $scope.addFiles = false;
    $scope.gasit = false;
    $scope.fisierGasit = (chapter) => {
        if ($scope.chapter.chBlob != null) {
            return true;
        }
        return false;
    };
    let $constructor = () => {
        $http.get(SERVER + '/courses/' + $stateParams.id)
            .then((response) => {
                $scope.course = response.data
                return $http.get(SERVER + '/courses/' + $stateParams.id + '/chapters')
            })
            .then((response) => {
                if (response.data.length != 0) {
                    $scope.gasit = true;
                    $scope.chapters = response.data
                    $scope.chapter = $scope.chapters[0]
                    var id = $scope.chapters[0].id
                    $http.get(SERVER + '/chapters/' + id)
                        .then((response) => {
                            $http.get("/fisier/" + $stateParams.id + "/" + $scope.chapter.id)
                                .then((response) => {
                                    $scope.file = response
                                    $scope.chapter.chBlob = "/fisier/" + $stateParams.id + "/" + $scope.chapter.id
                                })
                            $scope.comments = response.data
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    $constructor()
    $scope.schimba = () => {
        if ($scope.addFiles == true) {
            $scope.addFiles = false;
        }
        else {
            $scope.addFiles = true;
        }
    }
    $scope.onFileSelect = ($files) => {
        Upload.upload({
                url: SERVER + "/fisier",
                file: $files[0],
                data: {
                    idCourse: $stateParams.id,
                    idChapter: $scope.chapter.id
                }
            }).progress(function(e) {
                // console.log(e)

            }).then(function(data, status, headers, config) {
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })
        alert("Fisierul a fost adaugat!")
        $state.go($state.current, {}, {
            reload: true
        })

    }

    $scope.getIdChapter = function(id) {
        for (var i = 0; i < $scope.chapters.length; i++) {
            if ($scope.chapters[i].id == id) {
                $scope.chapter = $scope.chapters[i];
                $http.get(SERVER + '/chapters/' + id)
                    .then((response) => {
                        $scope.comments = response.data
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                $http.get("/fisier/" + $stateParams.id + "/" + $scope.chapter.id)
                    .then((response) => {
                        $scope.file = response
                        $scope.chapter.chBlob = "/fisier/" + $stateParams.id + "/" + $scope.chapter.id
                        console.log($scope.chapter.chBlob)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }
    $scope.tipChapters = false;
    if ($cookies.get("idProfessor"))
        $scope.tipChapters = true;
    $scope.addChapter = () => {
        $state.go('addChapter', {
            id: $state.params.id
        })
    }
    $scope.deleteCourse = (course) => {
        $http.delete(SERVER + "/courses/" + course.id)
            .then((response) => {
                $state.go('courses')
            })
            .catch((error) => {
                console.log(error)
            })
    }
    $scope.accesareTest = (course) => {
        if ($cookies.get("idProfessor")) {
            $http.get("/courses/" + course.id + "/quiz")
                .then((response) => {
                    if (response.data == false) {
                        var data = {
                            idCourse: course.id
                        }
                        $http.post("/courses/" + course.id + "/quiz", data)
                            .then((res) => {
                                $state.go('quiz', {
                                    id: course.id
                                })
                            })
                    }
                    else {
                        $state.go('quiz', {
                            id: course.id
                        })
                    }
                })
        }
        else {
            if ($cookies.get("idStudent")) {
                var d = new Date(new Date().toDateInputValue());
                var f = new Date(new Date().toDateInputValue()).toISOString();
                $http.get("/courseStudents/" + course.id + "/getGrade/" + parseInt($cookies.get("idStudent")))
                    .then((response) => {
                        if (course.cBeginDate<f && course.cEndDate>f) {
                            var timeDiff = Math.abs(d.getTime() - new Date(response.data.updatedAt).getTime());
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            if (response.data.csGrade == null && diffDays < course.cMaxDays) {
                                $http.get("/courses/" + course.id + "/quiz")
                                    .then((res) => {
                                        if (res.data == false) {
                                            alert("Acest curs nu are creat testul inca!")
                                        }
                                        else {
                                            $state.go('quiz', {
                                                id: course.id
                                            })
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            }
                            else {
                                if (response.data.csGrade != null && diffDays < course.cMaxDays) {
                                    alert("Deja ati dat testul la acest curs!")
                                }
                                else {
                                    if (response.data.csGrade == null && diffDays > course.cMaxDays)
                                        alert("Timpul destinat cursului a expirat!")
                                }
                            }
                        }
                        else{
                            alert("Testul la acest curs nu mai este disponibil!")
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            }
        }
    }
    $scope.editCourse = (course) => {
        $state.go('editCourse', {
            id: course.id
        })
    }

    $scope.editChapter = (chapter) => {
        $state.go('editChapter', {
            id: chapter.id
        })
    }
    $scope.deleteChapter = (chapter) => {
        $http.delete(SERVER + "/courses/" + $stateParams.id + "/chapters/" + $scope.chapter.id)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => {
                console.warn(error)
            })
    }
    $scope.sendComment = (comment) => {
        if ($cookies.get("idProfessor")) {
            comment.idProfessor = parseInt($cookies.get("idProfessor"))
            comment.idChapter = $scope.chapter.id
            var obiect1 = {
                chapterId: $scope.chapter.id,
                comment: comment
            }
            $http.post(SERVER + '/chapters/', obiect1)
                .then((response) => {
                    $scope.comment = {}
                    $scope.commentForm.$setPristine()
                    $scope.commentForm.$setUntouched()
                    var responseData = response.data;
                    $http.get(SERVER + '/professors/get_name/' + response.data.idProfessor)
                        .then((response) => {
                            var commentObiect = {
                                description: responseData.pcomText,
                                createdAt: responseData.createdAt,
                                userName: response.data.pName
                            }
                            var commeeents = $scope.comments;
                            $scope.comments = [];
                            $scope.comments.push(commentObiect);
                            for (var i = 0; i < commeeents.length; i++) {
                                $scope.comments.push(commeeents[i]);
                            }
                        })

                })
                .catch((error) => {
                    console.warn(error)
                })
        }
        else {
            if ($cookies.get("idStudent")) {
                comment.idStudent = parseInt($cookies.get("idStudent"))
                comment.idChapter = $scope.chapter.id
                comment.comText = comment.pcomText
                var obiect1 = {
                    chapterId: $scope.chapter.id,
                    comment: comment
                }
                $http.post(SERVER + '/chaptersS/', obiect1)
                    .then((response) => {
                        $scope.comment = {}
                        $scope.commentForm.$setPristine()
                        $scope.commentForm.$setUntouched()
                        var responseData = response.data
                        $http.get(SERVER + '/students/get_name/' + response.data.idStudent)
                            .then((response) => {
                                var commentObiect = {
                                    description: responseData.comText,
                                    createdAt: responseData.createdAt,
                                    userName: response.data.sName
                                }
                                var commeeents = $scope.comments;
                                $scope.comments = [];
                                $scope.comments.push(commentObiect);
                                for (var i = 0; i < commeeents.length; i++) {
                                    $scope.comments.push(commeeents[i]);
                                }
                            })
                    })
                    .catch((error) => {
                        console.warn(error)
                    })
            }
        }
    }
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    });
}])

.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
