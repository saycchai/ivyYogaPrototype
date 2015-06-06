"use restrict";

//dependencies is defined in main.js
angular.module(appName, dependencies)

.run(function($ionicPlatform, $state,$rootScope) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
		}

	});
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

	//place the tab icons at the bottom
	$ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
	$ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS

	//i18n
    $translateProvider.preferredLanguage("zh");
    $translateProvider.fallbackLanguage("en");

    $translateProvider.useStaticFilesLoader({
    	  prefix: 'i18n/',
    	  suffix: '.json'
    });
    

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

	$stateProvider

  // setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab"
		, abstract: true
		, templateUrl: "app/tabs.html"
  })
  
  ;

	
	
	// default state
	$urlRouterProvider.otherwise("/sign-in");

})

.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, appConfig) {
	
	$scope.showLeftMenu = function () {
		$ionicSideMenuDelegate.toggleLeft();
	}
	;

	$scope.showRightMenu = function () {
		//$ionicSideMenuDelegate.toggleRight();
		$state.go("setting");
	}
	;

	$scope.isSignInPage = function () {
		return $state.includes('signin');
	}
	;
	
	$scope.showLeftMenuIcon = function () {
		return $scope.showRightMenuIcon();
	}
	;
	
	$scope.showRightMenuIcon = function () {
		return !$scope.isSignInPage() && ($state.includes('tab')) && (dotOccurrence($state.current.name) === 1);
	}
	;
	
	$scope.showBackIcon = function () {
		return !$scope.isSignInPage() && (!$state.includes('tab'));
	}
	;

	$scope.back = function () {
		$ionicHistory.goBack();
	}
	;
	
	function dotOccurrence(str) {
		var count = (str.match(/\./g) || []).length;
		return count;
	}
})

;