pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t restaurant-website .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop restaurant-container || true
                docker rm restaurant-container || true

                docker run -d \
                --name restaurant-container \
                -p 80:80 \
                restaurant-website
                '''
            }
        }
    }
}
