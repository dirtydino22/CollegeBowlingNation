module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				curly: true,
				camelcase: true,
				eqeqeq: true,
				browser: true,
				indent: 4,
				smarttabs: true,
				node: true
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