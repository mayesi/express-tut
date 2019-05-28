// This is our Angular module and controller. We are using the $http service to make an 
// AJAX request to the endpoint and updating the scope accordingly. We are injecting the 
// $scope and $http services and defining and updating $scope to handle binding. CLIENT SIDE
// angular.module('nodeTodo', [])
// .controller('mainController', ($scope, $http) => {
//   $scope.formData = {};
//   $scope.todoData = {};
//   // Get all todos
//   $http.get('/api/v1/todos')
//   .success((data) => {
//     $scope.todoData = data;
//     console.log(data);
//   })
//   .error((error) => {
//     console.log('Error: ' + error);
//   });
// });