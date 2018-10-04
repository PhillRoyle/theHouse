pipeline {
  agent any

  stages {
    stage('Start') {
      steps {
        checkout scm
      }
    }

    stage('npm install') {
      steps {
        sh 'cd lambda/custom/ && npm install jest -D'
        sh 'cd lambda/custom/ && npm install virtual-alexa --save-dev'
      }
    }

    stage('Test') {
      steps {
        sh 'cd lambda/custom/ && npm test'
      }
    }

    stage('Deploy'){
      steps{
        sh 'mkdir myBuild && cp -R lambda myBuild/ && zip theHouse.zip myBuild'
        sh 'aws s3 cp theHouseJenkinsBuild.zip s3://my-jenkins-build/'
      }
    }
  }
}