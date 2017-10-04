'use strict'
/*global angular*/
const app=angular.module('licentaapp', [
    'ui.router',
    'licentaModule',
    'ngMessages',
    'ngCookies',
    'ngFileUpload',
    'chart.js'
    ])
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home')
    $stateProvider
    .state("home", {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'licentaController'
    })
    .state('courses', {
        url: '/courses',
        templateUrl: 'views/cursuri.html',
        controller: 'cursuriController'
    })
    .state('login',{
        url:'/login',
        templateUrl:'views/login.html',
        controller:'loginController'
    })
    .state('register',{
        url:'/register',
        templateUrl:'views/register.html',
        controller:'registerController'
    })
    .state('chapters',{
        url:'/courses/:id/chapters',
        templateUrl:'views/chapters.html',
        controller:'chaptersController'
    })
    .state('disconnect',{
        controller:'disconnectController'
    })
    .state('addCourse',{
        url:'/addCourse',
        templateUrl:'views/addCourse.html',
        controller:'addCourseController'
    })
    .state('addChapter',{
        url:'/addChapter/:id',
        templateUrl:'views/addChapter.html',
        controller:'addChapterController'
    })
    .state('myProfile',{
        url:'/myProfile',
        templateUrl:'views/myProfile.html',
        controller:'myProfileController'
    })
    .state('editCourse',{
        url:'/editCourse/:id',
        templateUrl:'views/editCourse.html',
        controller:'editCourseController'
    })
    .state('editChapter',{
        url:'/editChapter/:id',
        templateUrl:'views/editChapter.html',
        controller:'editChapterController'
    })
    .state('adminLogin',{
        url:'/admin',
        templateUrl:'views/adminLogin.html',
        controller:'adminLoginController'
    })
    .state('administration',{
        url:'/administration',
        templateUrl:'views/administration.html',
        controller:'administrationController'
    })
    .state('gestionareCereri',{
        url:'/gestionareCereri/:id',
        templateUrl:'views/gestionareCereri.html',
        controller:'gestionareCereriController'
    })
    .state('quiz',{
        url:'/quiz/:id',
        templateUrl:'views/quiz.html',
        controller:'quizController'
    })
}])