describe('WS Service Unit Tests', function(){
    var wsService, $httpBackend, appConfig;
	
	beforeEach(function () {
			module(appServicePrefix + '.appConfig');
			module(appServicePrefix + '.wsService');
		}
	);

	//inject cms service factory
    beforeEach(inject(function (_wsService_, _$httpBackend_, _appConfig_) {
        wsService = _wsService_;
		$httpBackend = _$httpBackend_;
		appConfig = _appConfig_;
    }));

    it('can get an instance of appConfig constants', inject(function(appConfig) {
        expect(appConfig).toBeDefined();
    }));

    it('can get an instance of ws service factory', inject(function(wsService) {
        expect(wsService).toBeDefined();
    }));

    it('has 3 records', inject(function(wsService, $rootScope, appConfig) {
	
		$httpBackend.whenGET(appConfig.wsUrl+"/cms/find/live/en?&limit=3&query=SELECT * FROM [nt:file] ORDER BY [jcr:created] desc").respond(
			[{"node":{"jcr:created":"2015-04-15T15:13:25.410+08:00","j:originWS":"default","jcr:lastModified":"2015-04-15T15:13:25.598+08:00","jcr:createdBy":"root","jcr:mixinTypes":["jmix:exif","jmix:image"],"jcr:uuid":"fa1758bd-26a8-41ae-8598-93578cb177e0","jcr:baseVersion":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/fa/17/58/fa1758bd-26a8-41ae-8598-93578cb177e0/1.2.html","j:width":"800","jcr:isCheckedOut":"true","path":"/sites/poa/files/bootstrap/img/nwthouse2.jpg","nodename":"nwthouse2.jpg","j:height":"495","index":1,"j:published":"true","j:lastPublishedBy":"root","j:nodename":"nwthouse2.jpg","jcr:versionHistory":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/fa/17/58/fa1758bd-26a8-41ae-8598-93578cb177e0.html","jcr:lastModifiedBy":"root","depth":6,"j:xresolution":"96 dots","primaryNodeType":"jnt:file","j:yresolution":"96 dots","j:lastPublished":"2015-04-15T15:14:19.666+08:00","identifier":"fa1758bd-26a8-41ae-8598-93578cb177e0","jcr:primaryType":"jnt:file","j:fullpath":"/sites/poa/files/bootstrap/img/nwthouse2.jpg"},"nt:file.jcr:created":"2015-04-15T15:13:25.410+08:00","nt:file.jcr:primaryType":"jnt:file","nt:file.jcr:createdBy":"root"},{"node":{"jcr:created":"2015-04-15T15:13:25.114+08:00","j:originWS":"default","jcr:lastModified":"2015-04-15T15:13:25.361+08:00","jcr:createdBy":"root","jcr:mixinTypes":["jmix:exif","jmix:image"],"jcr:uuid":"744a7349-5d00-4525-96dd-053f020dc5cb","jcr:baseVersion":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/74/4a/73/744a7349-5d00-4525-96dd-053f020dc5cb/1.2.html","j:width":"798","jcr:isCheckedOut":"true","path":"/sites/poa/files/bootstrap/img/nwthouse1.jpg","nodename":"nwthouse1.jpg","j:height":"487","index":1,"j:published":"true","j:lastPublishedBy":"root","j:nodename":"nwthouse1.jpg","jcr:versionHistory":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/74/4a/73/744a7349-5d00-4525-96dd-053f020dc5cb.html","jcr:lastModifiedBy":"root","depth":6,"j:xresolution":"96 dots","primaryNodeType":"jnt:file","j:yresolution":"96 dots","j:lastPublished":"2015-04-15T15:14:19.666+08:00","identifier":"744a7349-5d00-4525-96dd-053f020dc5cb","jcr:primaryType":"jnt:file","j:fullpath":"/sites/poa/files/bootstrap/img/nwthouse1.jpg"},"nt:file.jcr:created":"2015-04-15T15:13:25.114+08:00","nt:file.jcr:primaryType":"jnt:file","nt:file.jcr:createdBy":"root"},{"node":{"jcr:created":"2015-04-15T15:13:22.902+08:00","j:originWS":"default","jcr:lastModified":"2015-04-15T15:13:25.017+08:00","jcr:createdBy":"root","jcr:mixinTypes":["jmix:exif","jmix:image"],"jcr:uuid":"fb30f8b8-769c-453f-b332-63fd14d1309a","jcr:baseVersion":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/fb/30/f8/fb30f8b8-769c-453f-b332-63fd14d1309a/1.2.html","j:width":"799","jcr:isCheckedOut":"true","path":"/sites/poa/files/bootstrap/img/nwthouse3.jpg","nodename":"nwthouse3.jpg","j:height":"490","index":1,"j:published":"true","j:lastPublishedBy":"root","j:nodename":"nwthouse3.jpg","jcr:versionHistory":"/cms/render/live/en/jcr%3asystem/jcr%3aversionStorage/fb/30/f8/fb30f8b8-769c-453f-b332-63fd14d1309a.html","jcr:lastModifiedBy":"root","depth":6,"j:xresolution":"96 dots","primaryNodeType":"jnt:file","j:yresolution":"96 dots","j:lastPublished":"2015-04-15T15:14:19.666+08:00","identifier":"fb30f8b8-769c-453f-b332-63fd14d1309a","jcr:primaryType":"jnt:file","j:fullpath":"/sites/poa/files/bootstrap/img/nwthouse3.jpg"},"nt:file.jcr:created":"2015-04-15T15:13:22.902+08:00","nt:file.jcr:primaryType":"jnt:file","nt:file.jcr:createdBy":"root"}]
		);
	
		var cnt = 0;
		var promise = wsService.getCarousel();
		var data;
		
		promise.then(
			function( data ) {
				console.log(data);
				cnt = data.data.length;
			}
		);
		
		$httpBackend.flush();
		
		console.log("cnt: " + cnt);
		
		//$rootScope.$digest();
        expect(cnt).toEqual(3);
    }));
});