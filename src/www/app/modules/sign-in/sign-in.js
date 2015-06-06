angular.module(appModulePrefix + '.signin', [])
//ui router
.config(function($stateProvider) {

  $stateProvider
	.state('signin', {
		url : '/sign-in',
		templateUrl : 'app/modules/sign-in/sign-in.html',
		controller : 'SignInCtrl'
	})
	;
})


//controller
.controller('SignInCtrl', function($scope, $state) {
	  
	  $scope.signIn = function(user) {
	    console.log('Sign-In', user);
	    $state.go('tab.schedule');
	  };	  
})

;