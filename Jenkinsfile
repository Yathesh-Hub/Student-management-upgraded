pipeline {
    agent any

    environment {
        MONGODB_URI = 'mongodb://172.17.0.1:27017/student_management'
        JWT_SECRET = 'jenkins-local-secret-key-12345'
        NODE_ENV = 'development'
        PORT = '5000'
    }

    stages {
        stage('Cleanup Previous Containers') {
            steps {
                script {
                    echo '🧹 Cleaning up previous containers...'
                    sh '''
                        docker stop student-app || true
                        docker rm student-app || true
                        docker stop mongodb || true
                        docker rm mongodb || true
                    '''
                }
            }
        }

        stage('Start MongoDB') {
            steps {
                script {
                    echo '🗄️ Starting MongoDB container...'
                    sh '''
                        docker run -d \
                        --name mongodb \
                        -p 27017:27017 \
                        -v mongodb_data:/data/db \
                        mongo:7
                    '''
                    
                    echo '⏳ Waiting for MongoDB to be ready...'
                    sh 'sleep 10'
                    
                    echo '✅ MongoDB is ready!'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '📦 Installing Node.js dependencies...'
                    dir('backend') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🐳 Building Docker image...'
                    sh 'docker build -t student-management:latest .'
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    echo '🚀 Starting application container...'
                    sh """
                        docker run -d \
                        --name student-app \
                        -p 5000:5000 \
                        -e MONGODB_URI='${MONGODB_URI}' \
                        -e JWT_SECRET='${JWT_SECRET}' \
                        -e NODE_ENV='${NODE_ENV}' \
                        -e PORT='${PORT}' \
                        student-management:latest
                    """
                    
                    echo '⏳ Waiting for application to start...'
                    sh 'sleep 5'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo '🏥 Performing health check...'
                    sh '''
                        for i in {1..10}; do
                            if curl -f http://localhost:5000/api/health; then
                                echo "✅ Application is healthy!"
                                exit 0
                            fi
                            echo "⏳ Waiting for application... ($i/10)"
                            sleep 3
                        done
                        echo "❌ Health check failed!"
                        exit 1
                    '''
                }
            }
        }

        stage('Display Logs') {
            steps {
                script {
                    echo '📋 Application logs:'
                    sh 'docker logs student-app --tail 50'
                }
            }
        }
    }

    post {
        success {
            echo '''
            ✅ ========================================
            ✅ DEPLOYMENT SUCCESSFUL!
            ✅ ========================================
            
            🌐 Application URL: http://localhost:5000
            📊 Dashboard: http://localhost:5000/dashboard.html
            🔐 Login: http://localhost:5000/login.html
            
            📝 Next Steps:
            1. Open http://localhost:5000 in your browser
            2. Create a new account (Sign up)
            3. Login and start managing students
            
            🐳 Docker Containers:
            - MongoDB: mongodb (port 27017)
            - Application: student-app (port 5000)
            
            📊 View logs: docker logs student-app -f
            🛑 Stop app: docker stop student-app mongodb
            ✅ ========================================
            '''
        }
        failure {
            echo '''
            ❌ ========================================
            ❌ DEPLOYMENT FAILED!
            ❌ ========================================
            
            🔍 Troubleshooting:
            1. Check Jenkins console output above
            2. View application logs: docker logs student-app
            3. View MongoDB logs: docker logs mongodb
            4. Check if ports 5000 and 27017 are available
            
            🛑 Cleanup:
            docker stop student-app mongodb
            docker rm student-app mongodb
            ❌ ========================================
            '''
        }
        always {
            echo '🧹 Pipeline execution completed'
        }
    }
}
