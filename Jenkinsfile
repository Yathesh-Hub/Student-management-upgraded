pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t student-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop student-app || true
                docker rm student-app || true
                docker run -d -p 5000:5000 \
                -e MONGODB_URI="mongodb://host.docker.internal:27017/student_db" \
                --name student-app student-app
                '''
            }
        }

    }
}
