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
        sh 'cd lambda/custom/ && zip -r theHouse.zip *'
        sh 'aws s3 cp lambda/custom/theHouse.zip s3://my-jenkins-build/'
        sh 'aws lambda update-function-code --region us-east-1 --function-name ask-custom-theHouse-default --zip-file fileb://lambda/custom/theHouse.zip'
        sh 'rm lambda/custom/theHouse.zip'
      }
    }
  }
}