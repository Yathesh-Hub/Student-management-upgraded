pipeline {
    agent any

    stages {

        stage('Run MongoDB') {
            steps {
                sh '''
                docker stop mongodb || true
                docker rm mongodb || true
                docker run -d -p 27017:27017 --name mongodb mongo:6
                '''
            }
        }

        stage('Install Node Modules') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t student-app .'
            }
        }

        stage('Run App') {
            steps {
                sh '''
                docker stop student-app || true
                docker rm student-app || true

                docker run -d -p 5000:5000 \
                -e MONGODB_URI="mongodb://172.17.0.1:27017/student_db" \
                --name student-app student-app
                '''
            }
        }
    }
}
