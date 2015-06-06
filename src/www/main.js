"use restrict";

var appName = '@@name';
var appServicePrefix = appName + ".services";
var appModulePrefix = appName + ".modules";
var appDirectivePrefix = appName + ".directives";
var appFilterPrefix = appName + ".filters";

var dependencies = [
	"ionic"
	, "pascalprecht.translate"
	
	//services
	, appServicePrefix + '.appConfig'
	, appServicePrefix + '.wsService'
	, appServicePrefix + '.settingService'
	
	//modules
	, appModulePrefix + '.signin'
	, appModulePrefix + '.schedule'
	, appModulePrefix + '.setting'
	
	//directives
	, appDirectivePrefix + ".tabsSwipable"
	
	//filters
]
;
