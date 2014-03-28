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
			files: [
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
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint','concat','uglify']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['jshint','concat','uglify','watch']);
};