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
.controller('SignInCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup) {
	$scope.forgotPasswordUsername = "";

	$ionicModal.fromTemplateUrl('app/modules/sign-in/forgotPasswordModal.html'
		, {
			scope: $scope
			, animation: 'slide-in-up'
		}
	).then(function(modal) {
			$scope.modal = modal;
		}
	)
	;

	$scope.openModal = function() {
		$scope.modal.show();
	}
	;

	$scope.closeModal = function() {
		$scope.modal.hide();
	}
	;

	$scope.$on('$destroy'
		, function() {
			$scope.modal.remove();
		}
	)
	;

	$scope.signIn = function(user) {
		console.log('Sign-In', user);
	    $state.go('tab.schedule');
	};
	  
	// An alert dialog
	$scope.showAlert = function() {
		$scope.alertPopup = $ionicPopup.alert({
			title: 'Forgot Password',
			template: 'Forgot password email sent!'
		});

		$scope.alertPopup.then(function(res) {
			console.log('Forgot password email sent!');
			$scope.closeModal();
		});
	};
})

;