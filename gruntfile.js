'use strict';

const loadGruntTasks = require('load-grunt-tasks');
const rollupPluginBabel = require('rollup-plugin-babel');


module.exports = function register(grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    eslint: {
      all: ['lib', 'test'],
    },

    clean: {
      all: ['dist'],
    },

    rollup: {
      all: {
        options: {
          external: 'validator',
          plugins: [
            rollupPluginBabel(),
          ],
          format: 'cjs',
        },
        files: {
          'dist/index.rollup.js': 'lib/index.js',
          'dist/cast.rollup.js': 'lib/cast.js',
        },
      },
    },

    babel: {
      all: {
        files: [{
          expand: true,
          cwd: 'lib/',
          src: '**/*.js',
          dest: 'dist/',
        }],
      },
    },

    mochaTest: {
      test: {
        options: {
          timeout: 500,
        },
        src: ['test/**/*.test.js'],
      },
    },
  });

  grunt.registerTask('prepublish', ['eslint', 'clean', 'babel', 'rollup']);
  grunt.registerTask('test', ['prepublish', 'mochaTest']);

  grunt.registerTask('default', ['test']);
};
