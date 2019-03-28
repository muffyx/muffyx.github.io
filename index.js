var app = angular.module('myApp', []);
app.controller('TestCtrl', function($scope, $http) {
  $http.get("TestTaskJS1/data/test.json").then(function(response) {
      $scope.test = response.data;
      $scope.categories = response.data.categories;
      $scope.icons = response.data.icon.file;
      $scope.items = response.data.items;
      $scope.images = response.data.items.gallery_images;
    });
});