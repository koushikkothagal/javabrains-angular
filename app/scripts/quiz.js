(function () {
    var app = angular.module('quiz', ['ui.ace', 'ngSanitize', 'ngAnimate']);

    // Change the Expression syntax for angular from {{ to {(.
    // This is to prevent conflicts with Jekyll's Liquid syntax expression.
    app.config([
    '$interpolateProvider',
        function ($interpolateProvider) {
            return $interpolateProvider.startSymbol('{(').endSymbol(')}');
    }
  ]);

    String.prototype.endsWith = function (needle) {
        return needle === this.substr(0 - needle.length);
    }

    angular.module('jb3App')
    .service("dataService", function ($http, $q) {

        // Return public API.
        return ({
            getData: getData
        });



        // I get all of the friends in the remote collection.
        function getData(fileName) {
            var request = $http({
                method: "get",
                url: fileName,
                params: {
                    action: "get"
                }
            });

            return (request.then(handleSuccess, handleError));

        }

        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {

                return ($q.reject("An unknown error occurred."));

            }

            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {

            return (response.data);

        }

    });








angular.module('jb3App')
    .service('codeService', function () {

        this.compareCode = function (code, answer) {
            var cs = new CommentStripper();
            var regSpecialChars = /\s*([!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?])\s*/g;
            var regLineBreaks = /^\s+|\r+\n+|\n+|\r+|\s+$/g;
            var regSpaces = / +/g;
            code = cs.strip(code);
            code = code.trim();
            code = code.replace(regLineBreaks, " ");
            code = code.replace(regSpaces, " ");
            code = code.replace(regSpecialChars, "$1");


            answer = cs.strip(answer);
            answer = answer.trim();
            answer = answer.replace(regLineBreaks, " ");
            answer = answer.replace(regSpaces, " ");
            answer = answer.replace(regSpecialChars, "$1");

            return code == answer;
        };


    });

angular.module('jb3App')
.controller('QuizController', function ($scope, $http, $timeout, codeService, dataService, $log) {

    $scope.data.tutorialNum = "jkhgj";
        $scope.data = {
            "questions": [
                {
                    "question": ""
                }
        ]
        };

        $scope.initData = function (fileName) {
            $scope.dataFileName = fileName;
            loadRemoteData($scope.dataFileName);
        }


        function loadRemoteData(fileName) {

            // The dataService returns a promise.
            dataService.getData(fileName)
                .then(
                    function (data) {

                        applyRemoteData(data);

                    }
            );
        }

        function applyRemoteData(data) {

            $scope.data = data;
            this.currentQuestion = $scope.data.questions[0];
            $scope.currentQuestion = $scope.data.questions[0];
            $scope.qIndex = 0;

            $scope.currentWindow = $scope.data.questions[0].focus;


        }




        $scope.isCurrentWindow = function (window) {
            return $scope.currentWindow === window;
        }

        $scope.setWindow = function (window) {
            $scope.currentWindow = window;
        }

        $scope.isCodingQuestion = function (question) {
            if (question === undefined) return false;
            return question.type == "code";
        }

        $scope.isQuestionComplete = function (index) {
            if (index >= $scope.data.questions.length) return false;
            var flag = $scope.data.questions[index].isComplete;
            if (flag === undefined || !flag) return false;
            return flag;
        }

        $scope.getCompletedQuestions = function () {
            var completedQuestions = [];
            for (var i = 0; i < $scope.data.qIndex; i++) {
                completedQuestions.push($scope.data.questions[0]);
            }
            return completedQuestions;
        }

        $scope.getMode = function (file) {
            if (file.fileName.endsWith(".java")) {
                return "java";
            } else if (file.fileName.endsWith(".xml")) {
                return "xml";
            } else {
                return "";
            }
        }


        $scope.checkCodeComplete = function (file) {
            if (!file) return true;
            var code = file.codeStarter;
            var answer = file.codeAnswer;

            if (codeService.compareCode(code, answer)) {
                return true;
            }
        }


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
        }

        $scope.inputChanged = function () {
            if ($scope.currentQuestion.files) return;
            console.log('<' + $scope.currentQuestion.userInput '>');
            console.log('<' + $scope.currentQuestion.answer.trim().toLowerCase() '>');
            if ($scope.currentQuestion.userInput === $scope.currentQuestion.answer.trim().toLowerCase()) {
                $scope.currentQuestion.isComplete = true;
                $scope.showDialog();
                $scope.moveToNextQuestion();
            }

        }

        $scope.radioClicked = function (userAnswer) {
            if ($scope.currentQuestion.files) return;
            if (userAnswer === $scope.currentQuestion.answer) {
                $scope.currentQuestion.isComplete = true;
                $scope.showDialog();
                $scope.moveToNextQuestion();
            }

        }

        $scope.checkAllDone = function (question) {
            for (var i = 0; i < question.files.length; i++) {
                if (!$scope.checkCodeComplete(question.files[i])) return;
            }
            question.isComplete = true;
            $scope.showDialog();
            $scope.moveToNextQuestion();
        }

        $scope.isLastQuestion = function () {
            if ($scope.qIndex >= $scope.data.questions.length - 1) {
                return true;
            }
            return false;
        }

        $scope.showDialog = function () {
            $scope.dialogUp = true;
            $timeout(function () {
                $scope.dialogUp = false;
            }, 1000);
        }

        $scope.moveToNextQuestion = function () {
            if ($scope.qIndex < $scope.data.questions.length - 1) {
                $scope.qIndex++;
                $scope.currentQuestion = $scope.data.questions[$scope.qIndex];
                $scope.currentWindow = $scope.data.questions[$scope.qIndex].focus;
            } else {
                $scope.quizComplete = true;
            }



        }

        $scope.moveToQuestion = function (index) {
            if (index < $scope.data.questions.length) {
                $scope.qIndex = index;
                $scope.currentQuestion = $scope.data.questions[index];
                $scope.currentWindow = $scope.data.questions[index].focus;
            }



        }

        $scope.range = function (n) {
            if (n < 0) {
                n = 0;
            }
            return new Array(n);
        };

    });

})();
