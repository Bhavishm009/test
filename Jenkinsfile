pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from your version control system (e.g., Git)
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                // Run your application tests
                script {
                    sh 'npm test'
                }
            }
        }

        stage('Build') {
            steps {
                // Build your Node.js application
                script {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Deploy your application using SSH
                script {
                    sh 'ssh root@195.35.21.208/ "mkdir -p /path/to/deployment" && scp -r * root@195.35.21.208:/var/www/rest'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }

        failure {
            echo 'Deployment failed!'
        }
    }
}
