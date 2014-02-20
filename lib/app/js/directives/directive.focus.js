(function(angular) {
	'use strict';
	angular.module('app.directive.focus', [])
		.directive('ngFocus', [function () {
			var focusClass = 'ng-focused';
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, element, attrs, ctrl) {
					ctrl.$focused = false;
					element.bind('focus', function (evt) {
						element.addClass(focusClass);
						scope.$apply(function () {
							ctrl.$focused = true;
						});
					}).bind('blur', function (evt) {
						element.removeClass(focusClass);
						scope.$apply(function () {
							ctrl.$focused = false;
						});
					});
				}
			};
		}]);
}(angular));