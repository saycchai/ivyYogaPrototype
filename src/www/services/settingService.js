angular.module(appServicePrefix + '.settingService', [])
.factory(
    "settingService",
    function( $http, $q, appConfig ) {
		var lang;

        // Return public API.
        return({
        	getLang: getLang
			, setLang: setLang
        });


        // ---
        // PUBLIC METHODS.
        // ---

        // I get all of the friends in the remote collection.
        function getLang() {
			this.lang = this.lang || 'zh';

        	return this.lang;
        }

		function setLang(l) {
			this.lang = l;
		}
		
        // ---
        // PRIVATE METHODS.
        // ---
    }
)
;
