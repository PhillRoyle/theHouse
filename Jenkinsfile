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
        sh 'rm -rf myBuild && mkdir myBuild'
        sh 'cp -R lambda myBuild/'
        sh 'zip theHouse.zip myBuild'
        sh 'rm -rf myBuild'
        sh 'aws s3 cp theHouse.zip s3://my-jenkins-build/'
        sh 'aws lambda update-function-code --region us-east-1 --function-name ask-custom-theHouse-default --zip-file fileb://theHouse.zip'
      }
    }
  }
}