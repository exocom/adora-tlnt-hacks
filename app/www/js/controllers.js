angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope,$filter,  $firebaseArray, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


    // TODO : REMOVE! Testing only!!
    if(!window.cordova) {
      window.cordova = {plugins:{notification:{local: {schedule: function () {
        console.info(arguments);
      }}}}};
    }

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

    var ref = new Firebase("https://adora-hackthon.firebaseio.com/ads/ads");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.messages = $firebaseArray(ref);




    $scope.messages.$watch(function(event) {
      if(event.event === 'child_added') {
        var now = new Date().getTime(),
          _5_sec_from_now = new Date(now + 10 * 1000);


        var message = $filter('filter')($scope.messages,{$id: event.key})[0];
        console.info(message);

        var defaults = {
          id: 1,
          at: _5_sec_from_now,
          badge: 12
        };

        var notification = {
          title: message.title,
          text: message.body
        };

        var notificationWithDefaults = angular.extend({},defaults,notification);

        cordova.plugins.notification.local.schedule(notificationWithDefaults);
        message.isViewed = true;
        $scope.messages.$save();
      }
    });

  $scope.createAd = function () {
    $scope.messages.$add({ title: "Hello from the front end", message: "Some really long message" });
  };


    $scope.createLocalNotification = function () {
      var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 10 * 1000);

      cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Scheduled with delay',
        text: 'Test Message 1',
        at: _5_sec_from_now,
        badge: 12
      });
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
