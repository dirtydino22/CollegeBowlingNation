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
				'app/js/src/**/*.js',
				'lib/**/*.js'
			]
		},
		concat: {
			options: {
				seperator: ';'
			},
			dist: {
				src: ['app/js/src/**/*.js'],
				dest: 'app/js/dist/<%= pkg.name %>.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['jshint', 'concat']);
};