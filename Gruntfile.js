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
			js: {
				src: [
					'app/js/src/**/*.js'
				],
				dest: 'app/js/cbn.js'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			js: {
				files: {
					'app/js/cbn.min.js' : ['app/js/cbn.js']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['jshint','concat','uglify']);
};