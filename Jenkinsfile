pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from the Git repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests if applicable
                sh 'npm test'
            }
        }


        stage('Deploy') {
            steps {
                sh 'scp -r ./* /var/www/rest'
                sh 'cd /var/www/rest && pm2 restart server'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Your application is now live.'
        }

        failure {
            echo 'Deployment failed! Please check the logs for more information.'
        }
    }
}
