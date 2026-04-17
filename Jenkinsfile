pipeline {
    agent any

    environment {
        MONGODB_URI = 'mongodb://host.docker.internal:27017/student_management'
        JWT_SECRET = 'jenkins-local-secret-key-12345'
        NODE_ENV = 'development'
        PORT = '5000'
    }

    stages {

        stage('Cleanup Previous Containers') {
            steps {
                bat '''
                docker stop student-app
                docker rm student-app
                docker stop mongodb
                docker rm mongodb
                exit /b 0
                '''
            }
        }

        stage('Start MongoDB') {
            steps {
                bat '''
                docker run -d --name mongodb -p 27017:27017 mongo:7
                '''

                bat '''
                echo Waiting for MongoDB...
                ping 127.0.0.1 -n 10 > nul
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-management:latest .'
            }
        }

        stage('Run Application') {
            steps {
                bat '''
                docker run -d ^
                --name student-app ^
                -p 5000:5000 ^
                -e MONGODB_URI=mongodb://host.docker.internal:27017/student_management ^
                -e JWT_SECRET=jenkins-local-secret-key-12345 ^
                -e NODE_ENV=development ^
                -e PORT=5000 ^
                student-management:latest
                '''
        
                bat '''
                echo Waiting for app...
                ping 127.0.0.1 -n 8 > nul
                '''
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                curl http://localhost:5000
                '''
            }
        }

        stage('Logs') {
            steps {
                bat 'docker logs student-app'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Success'
        }

        failure {
            echo '❌ Deployment Failed'
        }

        always {
            echo 'Pipeline Completed'
        }
    }
}
