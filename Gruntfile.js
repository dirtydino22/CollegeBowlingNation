module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				curly: true,
				camelcase: true,
				eqeqeq: true,
				browser: true,
				indent: 4,
				smarttabs: true,
				node: true,
				globals: {
					angular: true
				}
			},
			all: [
				'Gruntfile.js',
				'app/js/**/*.js',
				'lib/**/*.js'
			]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);
};