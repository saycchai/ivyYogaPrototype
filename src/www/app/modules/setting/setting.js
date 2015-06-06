angular.module(appModulePrefix + '.setting', [])

//ui router
.config(function($stateProvider) {

	$stateProvider
	.state('setting'
		, {
			url: '/setting'
			, templateUrl: 'app/modules/setting/setting.html'
			, controller: 'SettingCtrl'
		}
	)
	;
})


//controller
.controller('SettingCtrl', function($scope, $translate, settingService) {

	$scope.settings = {};
	$scope.settings.languages = [{key: 'en', value: 'english'}, {key: 'zh', value: '中文'}];
	$scope.settings.lang = settingService.getLang();

	$scope.changeLanguage = function () {
		settingService.setLang($scope.settings.lang);
		$translate.use($scope.settings.lang);
	}
	;
	
})

;