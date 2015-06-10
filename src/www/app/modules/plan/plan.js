angular.module(appModulePrefix + '.plan', [])

//ui router
.config(function($stateProvider) {

  $stateProvider
  .state('tab.plan', {
      url: '/plan'
      , views: {
        'tab-plan': {
          templateUrl: 'app/modules/plan/plan.html'
          , controller: 'planCtrl'
        }
      }
    })
	;
})


//controller
.controller('planCtrl', function($scope, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, wsService, appConfig, settingService) {
	$scope.filteredClassplan = {};

	$scope.currentYogaClass = {};
	$scope.classplanData = {"headers":[], "classes":[[]]};
	
	//filter
	$scope.filters = {};
	$scope.filters.classroom = "";
	$scope.filters.teacher = "";

	//drop down data
	$scope.classroomList = [];
	$scope.teacherList = [];

	$scope.filter = function() {
		classes = $scope.classplanData.classes;

		//filter classroom
		for(i=0; i<classes.length; i++) {
			if(classes[i].classroom.key == $scope.filters.classroom) {
				//clone the json object to filteredClassplan
				$scope.filteredClassplan = (JSON.parse(JSON.stringify(classes[i])));
				$scope.filteredClassplan.classroomIdx = i;
				break;
			}
		}
		
		//filter teacher
		if($scope.filters.teacher === 'ALL') return;

		for(i=0; i<$scope.filteredClassplan.classplan.length; i++) {
			for(j=0; j<$scope.classplanData.headers.length; j++) {
				yogaClass = $scope.filteredClassplan.classplan[i][j];
				if(isEmptyYogaClass(yogaClass)) continue;
				
				if((yogaClass.teacher != $scope.filters.teacher)) {
					$scope.filteredClassplan.classplan[i][j] = {};
				}
			}
		}
	}
	;
	
	$scope.refresh = function () {
		loadRemoteData();
	}
	;
	
	$scope.getLang = function () {
		return settingService.getLang();
	}
	;

	$scope.showTableHeader = function (header) {
		var d = new Date(Date.parse(header.date));
		return header[$scope.getLang()]
				+ "\r\n" + "(" + d.getDate() + "/" + (d.getMonth() + 1) + ")"
				;
	}
	;
	
	$scope.showTableContent = function (yogaClass) {
		if(isEmptyYogaClass(yogaClass)) {
			return "";
		}

		return yogaClass[$scope.getLang()] 
				+ "\r\n" + yogaClass.start + "-" + yogaClass.end
				+ "\r\n" + yogaClass.teacher
				+ "\r\n" + "(" + yogaClass.vancancy + ")"
				;
	}
	;
	
	
	
	//initialize
	loadRemoteData();
	$scope.filter();

	
    // ---
    // PRIVATE METHODS.
    // ---

	function isEmptyYogaClass(yogaClass)
	{
		if(!('en' in yogaClass)) {
			return true;
		}
		
		return false;
	}
	
	function register(yogaClass)
	{
	
	}
	
	function reloadClassplan()
	{
		//hard code data for prototype
		
		$scope.teacherList = [{"code":"ALL", "name":"All Teachers"}, {"code":"Cissie", "name":"Cissie"}, {"code":"Clara", "name":"Clara"}, {"code":"Eva", "name":"Eva"}, {"code":"Ivy", "name":"Ivy"}, {"code":"Joyce", "name":"Joyce"}, {"code":"Sanas", "name":"Sanas"}];
		
		$scope.classplanData = {
			"headers":[ 
						{"zh":"一", "en":"Mon", "date":"2015-06-08"}
						, {"zh":"二", "en":"Tue", "date":"2015-06-09"}
						, {"zh":"三", "en":"Wed", "date":"2015-06-10"}
						, {"zh":"四", "en":"Thu", "date":"2015-06-11"}
						, {"zh":"五", "en":"Fri", "date":"2015-06-12"}
						, {"zh":"六", "en":"Sat", "date":"2015-06-13"}
						, {"zh":"日", "en":"Sun", "date":"2015-06-14"}
					]
			, "classes": [
				//元朗大馬路178號閣樓
				{
					"classroom": {"key":1, "zh":"元朗大馬路", "en":"Yuen Long Main Road"}
					, "classplan":[//time slot 1
									[
										{"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"10:00", "end":"11:30", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"10:00", "end":"11:30", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"10:00", "end":"11:30", "vancancy":30}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"10:00", "end":"11:30", "vancancy":30}
										, {}
										, {"key":1, "zh": "空中飄動瑜伽", "en": "Aerial Yoga", "teacher":"Sanas", "start":"10:30", "end":"11:45", "vancancy":30}
									]
									
								//time slot 2
									, [
										{"key":1, "zh": "呼吸伸展瑜伽", "en": "Stretch Yoga", "teacher":"Eva", "start":"11:45", "end":"13:00", "vancancy":30}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽(元朗劇院)", "en": "Slim Yoga (Yuen Long Theatre)", "teacher":"Joyce", "start":"11:15", "end":"12:45", "vancancy":20}
										, {"key":1, "zh": "纖體減壓瑜伽(元朗劇院)", "en": "Slim Yoga (Yuen Long Theatre)", "teacher":"Joyce", "start":"20:15", "end":"21:45", "vancancy":20}
										, {}
										, {"key":1, "zh": "空中飄動瑜伽", "en": "Aerial Yoga", "teacher":"Sanas", "start":"11:30", "end":"12:45", "vancancy":30}
										, {}
									]
									
								//time slot 3
									, [
										{"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"14:00", "end":"15:30", "vancancy":30}
										, {"key":1, "zh": "空中飄動瑜伽", "en": "Aerial Yoga", "teacher":"Sanas", "start":"14:00", "end":"15:15", "vancancy":30}
										, {"key":1, "zh": "空中飄動瑜伽(中級)", "en": "Aerial Yoga(Intermediate Level)", "teacher":"Sanas", "start":"14:00", "end":"15:15", "vancancy":30}
										, {}
										, {}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"13:45", "end":"15:00", "vancancy":30}
									]
								//time slot 4
									, [
										{}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"17:30", "end":"18:45", "vancancy":30}
										, {}
										, {}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"15:00", "end":"16:30", "vancancy":30}
										, {}
									]
								//time slot 5
									, [
										{"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"19:00", "end":"20:15", "vancancy":30}
										, {}
										, {"key":1, "zh": "重點修身瑜伽", "en": "Slim Fit Yoga", "teacher":"Clara", "start":"19:00", "end":"20:15", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Cissie", "start":"19:00", "end":"20:15", "vancancy":20}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"18:45", "end":"20:00", "vancancy":30}
										, {}
										, {}
									]
								//time slot 6
									, [
										{"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Eva", "start":"20:30", "end":"21:45", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"20:15", "end":"21:30", "vancancy":30}
										, {"key":1, "zh": "重點修身瑜伽", "en": "Slim Fit Yoga", "teacher":"Clara", "start":"20:30", "end":"21:45", "vancancy":30}
										, {"key":1, "zh": "動感瑜伽", "en": "Dynamic Yoga", "teacher":"Cissie", "start":"20:30", "end":"21:45", "vancancy":20}
										, {"key":1, "zh": "空中飄動瑜伽", "en": "Aerial Yoga", "teacher":"Sanas", "start":"20:30", "end":"21:45", "vancancy":30}
										, {}
										, {}
									]
								]
				}
				, 
				
				//元朗同樂街13號一樓
				{
					"classroom": {"key":2, "zh":"元朗同樂街", "en":"Yuen Long Tung Lok Street"}
					, "classplan":[//time slot 1
									[
										{}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"10:00", "end":"11:30", "vancancy":30}
										, {}
										, {"key":1, "zh": "動感瑜伽", "en": "Dynamic Yoga", "teacher":"Ivy", "start":"10:00", "end":"11:30", "vancancy":20}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"10:00", "end":"11:30", "vancancy":30}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Ivy", "start":"10:30", "end":"11:45", "vancancy":20}
									]
									
								//time slot 2
									, [
										{}
										, {}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Eva", "start":"12:15", "end":"13:30", "vancancy":20}
										, {}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Joyce", "start":"12:15", "end":"13:45", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"11:45", "end":"13:15", "vancancy":30}
										, {"key":1, "zh": "高溫重點修身瑜伽", "en": "Hot Yoga", "teacher":"Sanas", "start":"12:30", "end":"13:45", "vancancy":20}
									]
									
								//time slot 3
									, [
										{}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"14:00", "end":"15:30", "vancancy":30}
										, {}
										, {"key":1, "zh": "重點修身瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"14:00", "end":"15:30", "vancancy":30}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Joyce", "start":"14:00", "end":"15:15", "vancancy":30}
										, {}
										, {}
									]
								//time slot 4
									, [
										{}
										, {}
										, {}
										, {}
										, {}
										, {"key":1, "zh": "高溫重點修身瑜伽", "en": "Hot Yoga", "teacher":"Cissie", "start":"16:30", "end":"17:45", "vancancy":30}
										, {}
									]
								//time slot 5
									, [
										{"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"19:00", "end":"20:15", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"19:00", "end":"20:15", "vancancy":30}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Joyce", "start":"19:00", "end":"20:15", "vancancy":30}
										, {"key":1, "zh": "動感瑜伽", "en": "Dynamic Yoga", "teacher":"Ivy", "start":"19:00", "end":"20:15", "vancancy":20}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"19:00", "end":"20:15", "vancancy":30}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Cissie", "start":"19:30", "end":"20:45", "vancancy":30}
										, {}
									]
								//time slot 6
									, [
										{"key":1, "zh": "高溫重點修身瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"20:30", "end":"21:45", "vancancy":30}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"20:30", "end":"21:45", "vancancy":30}
										, {"key":1, "zh": "高溫排毒纖體瑜伽", "en": "Hot Yoga", "teacher":"Joyce", "start":"20:30", "end":"21:45", "vancancy":30}
										, {"key":1, "zh": "高溫動感瑜伽", "en": "Hot Yoga", "teacher":"Ivy", "start":"20:30", "end":"21:45", "vancancy":20}
										, {"key":1, "zh": "纖體減壓瑜伽", "en": "Slim Yoga", "teacher":"Ivy", "start":"20:30", "end":"21:45", "vancancy":30}
										, {}
										, {}
									]
								]
				}
			]
		}
		;
        // The services return a promise.
    	// wsService.getClassplan()
            // .then(
                // function( classplanData ) {
                	// $scope.classplanData = classplanData;
                // }
            // )
        // ;
	}

    // I load the remote data from the server.
    function loadRemoteData() {
    	reloadClassplan();

		for(i=0; i<$scope.classplanData.classes.length; i++) {
			$scope.classroomList[i] = $scope.classplanData.classes[i].classroom;
		}
		
		if($scope.filters.classroom === null || $scope.filters.classroom === '') {
			$scope.filters.classroom = $scope.classroomList[0].key;
		}

		if($scope.filters.teacher === null || $scope.filters.teacher === '') {
			$scope.filters.teacher = $scope.teacherList[0].code;
		}
    }
	
})

;