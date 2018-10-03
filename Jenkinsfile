#!/usr/bin/env groovy

pipeline {
    agent {
        node {
            label 'master'
            customWorkspace "/local-workspace/${JOB_NAME}/${BUILD_NUMBER}/"
        }
    }
    environment{
        NODEJS_HOME="${tool 'Node 8 LTS'}"
        PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
    }
    stages {
        stage("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }
        stage("Build Packages") {
            steps {
   				      sh "npm run clean-build"
            }
        }
        stage("Tests") {
            parallel {
                stage("Unit Tests") {
                    steps {
                        sh "npm test"
                    }
                }
                stage("Integration Tests") {
                    steps {
                        // sh "npm run integration"
                        echo "finito!"
                    }
                }
            }
        }
    }
}