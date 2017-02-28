/**
 * @file
 */
module.exports = function(grunt) {

  // This is where we configure each task that we'd like to run.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    availabletasks: {
      tasks: {}
    },
    sasslint: {
      options: {
        configFile: '.sass-lint.yml'
      },
      target: ['core/\*\*/\*.scss']
    },
    sassdoc: {
      default: {
        src: 'core',
      }
    },
    sass: {
      // This will compile all of our sass files
      // Additional configuration options can be found at https://github.com/sindresorhus/grunt-sass
      options: {
        includePaths: [
          "node_modules/bourbon/core",
          "node_modules/bourbon-neat/core",
          "node_modules/font-awesome/scss",
          "node_modules/normalize.css",
          "node_modules/neat-omega",
          "node_modules",
          "core"
        ],
        sourceMap: true,
        // This controls the compiled css and can be changed to nested, compact or compressed.
        outputStyle: 'expanded',
        precision: 5
      },
      dist: {
        files: {
          'examples/css/index.css': 'examples/scss/index.scss',
        }
      }
    },
    watch: {
      css: {
        files: ['examples/**/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // This is where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-available-tasks');
  grunt.loadNpmTasks('grunt-sassdoc');
  grunt.loadNpmTasks('grunt-sass-lint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // This is where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['availabletasks']);
};