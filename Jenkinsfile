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
  }
}