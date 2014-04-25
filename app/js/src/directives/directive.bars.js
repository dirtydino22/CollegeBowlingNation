(function() {
	angular.module('app.directive.bars', []).directive('bars', [
		function() {
			return {
				restrict: 'A',
				replace: true,
				scope: {
					data: '='
				},
				template: '<div id="chart"></div>',
				link: function($scope, $element, $attrs) {
					var labels = ['Pin Count', 'Strikes', 'Spares', 'Gutter-Balls', 'Rolls'];
					var chart = d3.select($element[0])
							.append('div').attr('class', 'chart')
							.selectAll('div')
							.data($scope.data).enter()
							.append('div')
							.transition().ease('elastic')
							.style('width', function(d) {
								return d + '%';
							})
							.attr('text-anchor', 'middle')
							.text(function(d) {
								return d + '%';
							});
					$scope.$watch('data',function(newVal, oldVal) {
						if (!newVal) {
							return oldVal;
						}
						chart = d3.select($element[0]).selectAll('*').remove();
						chart = d3.select($element[0])
							.append('div').attr('class', 'chart')
							.selectAll('div')
							.data(newVal).enter()
							.append('div')
							.transition().ease('elastic')
							.style('width', function(d) {
								if (d < 15) {
									return d + 5 + '%';
								}
								else if (d > 100) {
									return d * 0.1 + '%';
								}
								else if (d > 1000) {
									return d * 0.01 + '%';
								}
								else if (d > 100000) {
									return d * 0.001 + '%';
								}
								else {
									return d + '%';
								}
								
								//return 100 % d + 'px';
							})
							.attr('text-anchor', 'middle')
							.text(function(d, index) {
								return labels[index] + ' ' + d;
							});
						return chart;
					});
				}
			};
		}
	]);
}).call(this);