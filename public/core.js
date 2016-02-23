var cluster = angular.module('clustering', []);

cluster.controller('mainController', ['$scope', '$http', function($scope, $http) {
    

    // when landing on the page, get all todos and show them
    $http.get('/api/cluster')
        .success(function(data) {
         $scope.Cluster = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
   //function to update the rating value
   $scope.updateRating = function(index,id,val_rating)
    {

        
        var id1 = $scope.Cluster[index]._id;
        
        //send the product_id as a URL and val_rating : the user selected rating
        $http.post('/api/cluster/'+id1+"?q="+val_rating)
              .success (function(data) {
                  $scope.Cluster[index].average_rating = data.average_rating;
                  $scope.Cluster[index].rating = data.rating;
                  console.log(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
          }



}]);