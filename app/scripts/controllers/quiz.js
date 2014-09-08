'use strict';

/**
 * @ngdoc function
 * @name jbAngularApp.controller:QuizcontrollerCtrl
 * @description
 * # QuizcontrollerCtrl
 * Controller of the jbAngularApp
 */
angular.module('jb3App')
  .controller('QuizCtrl', function ($scope, $http, $timeout, codeService, dataService) {
     $scope.data = {
            'questions': [
                {
                    'question': ''
                }
        ]
        };

        $scope.initData = function (fileName) {
            $scope.dataFileName = fileName;
            loadRemoteData($scope.dataFileName);
        };


        function loadRemoteData(fileName) {

            // The dataService returns a promise.
            dataService.getData(fileName)
                .then(
                    function (data) {

                        applyRemoteData(data);

                    }
            );
        };

        function applyRemoteData(data) {

            $scope.data = data;
            // this.currentQuestion = $scope.data.questions[0];
            $scope.currentQuestion = $scope.data.questions[0];
            $scope.qIndex = 0;

            $scope.currentWindow = $scope.data.questions[0].focus;
        };
      
      

        $scope.isCurrentWindow = function (window) {
            return $scope.currentWindow === window;
        };

        $scope.setWindow = function (window) {
            $scope.currentWindow = window;
        };

        $scope.isCodingQuestion = function (question) {
            if (question === undefined) return false;
            return question.type == "code";
        };

        $scope.isQuestionComplete = function (index) {
            if (index >= $scope.data.questions.length) return false;
            var flag = $scope.data.questions[index].isComplete;
            if (flag === undefined || !flag) return false;
            return flag;
        };

        $scope.getCompletedQuestions = function () {
            var completedQuestions = [];
            for (var i = 0; i < $scope.data.qIndex; i++) {
                completedQuestions.push($scope.data.questions[0]);
            }
            return completedQuestions;
        };

        $scope.getMode = function (file) {
            if (file.fileName.endsWith(".java")) {
                return "java";
            } else if (file.fileName.endsWith(".xml")) {
                return "xml";
            } else {
                return "";
            }
        };


        $scope.checkCodeComplete = function (file) {
            if (!file) return true;
            var code = file.codeStarter;
            var answer = file.codeAnswer;

            if (codeService.compareCode(code, answer)) {
                return true;
            }
        };


        $scope.aceChanged = function () {

            if (!$scope.currentQuestion.files) return;
            var currentFile = $scope.currentQuestion.files[$scope.currentWindow];
            // If current file is not already code complete, check if it is
            if (currentFile && !currentFile.isCodeComplete && $scope.checkCodeComplete(currentFile)) {
                // Current file is code complete. Check if all other files are done, so that we can move to next question.
                currentFile.isCodeComplete = true;
                $scope.checkAllDone($scope.currentQuestion);
                // alert("Yaay");
            }
        };

        $scope.inputChanged = function () {
            if ($scope.currentQuestion.files) return;
            if ($scope.currentQuestion.userInput.trim().toLowerCase() === $scope.currentQuestion.answer) {
                $scope.currentQuestion.isComplete = true;
                $scope.showDialog();
                $scope.moveToNextQuestion();
            }

        };

        $scope.radioClicked = function (userAnswer) {
            if ($scope.currentQuestion.files) return;
            if (userAnswer === $scope.currentQuestion.answer) {
                $scope.currentQuestion.isComplete = true;
                $scope.showDialog();
                $scope.moveToNextQuestion();
            }

        };

        $scope.checkAllDone = function (question) {
            for (var i = 0; i < question.files.length; i++) {
                if (!$scope.checkCodeComplete(question.files[i])) return;
            }
            question.isComplete = true;
            $scope.showDialog();
            $scope.moveToNextQuestion();
        };

        $scope.isLastQuestion = function () {
            if ($scope.qIndex >= $scope.data.questions.length - 1) {
                return true;
            }
            return false;
        };

        $scope.showDialog = function () {
            $scope.dialogUp = true;
            $timeout(function () {
                $scope.dialogUp = false;
            }, 1000);
        };

        $scope.moveToNextQuestion = function () {
            if ($scope.qIndex < $scope.data.questions.length - 1) {
                $scope.qIndex++;
                $scope.currentQuestion = $scope.data.questions[$scope.qIndex];
                $scope.currentWindow = $scope.data.questions[$scope.qIndex].focus;
            } else {
                $scope.quizComplete = true;
            }



        };

        $scope.moveToQuestion = function (index) {
            if (index < $scope.data.questions.length) {
                $scope.qIndex = index;
                $scope.currentQuestion = $scope.data.questions[index];
                $scope.currentWindow = $scope.data.questions[index].focus;
            }



        };

        $scope.range = function (n) {
            if (n < 0) {
                n = 0;
            }
            return new Array(n);
        };

  });
