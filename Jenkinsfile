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
        sh 'npm install '
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}