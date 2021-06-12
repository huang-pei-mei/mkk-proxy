module.exports = function(grunt) {
  // Project config
  grunt.initConfig({
    awsKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    aws_s3: {
      options: {
        accessKeyId: '<%= awsKey %>',
        secretAccessKey: '<%= awsSecret %>',
        region: 'us-west-2'
      },
      staging: {
        options: {
          bucket: 'rpt27-fec-audible',
          differential: true
        },
        files: [
          {expand: true, cwd: 'service-price/public/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
          {expand: true, cwd: 'service-reviews/dist/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
          {expand: true, cwd: 'service-summary/public/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
          {expand: true, cwd: 'service-title/public/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
          {expand: true, cwd: 'service-agg/public/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
          {expand: true, cwd: 'service-also-enjoyed/public/', src: ['**/*.js'], dest: 'scripts/', action: 'upload'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.registerTask('default', ['aws_s3']);
}