describe('Setting controller test', function(){
    var scope, translate;

    // load the controller's module
	beforeEach(function () {
			module('ui.router');
			module(appServicePrefix + '.appConfig');
			module(appModulePrefix+'.setting');
		}
	);

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('SettingCtrl', {$scope: scope, $translate: translate});
    }));

    // tests start here
    it('default lang should be lang', function(){
        expect(scope.settings.lang).toEqual('en');
    });
});