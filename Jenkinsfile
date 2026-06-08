// ============================================================
// Jenkinsfile — Restaurant Website CI/CD Pipeline
// Project: MCA Final Year | Author: [Your Name]
// Pipeline: GitHub → Jenkins → Docker → DockerHub → EC2 Deploy
// ============================================================

pipeline {
    agent any

    // ── Global environment variables ──────────────────────────
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME             = 'faizan0108/restaurant-app'
        IMAGE_TAG              = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
        CONTAINER_NAME         = 'restaurant-website'
        APP_PORT               = '80'
    }

    // ── Pipeline-level options ────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    // ── Auto-trigger on GitHub push ───────────────────────────
    triggers { githubPush() }

    // ════════════════════════════════════════════════════════
    // PIPELINE STAGES
    // ════════════════════════════════════════════════════════
    stages {

        // ── STAGE 1: Checkout ─────────────────────────────────
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                sh 'echo "✅ Checked out commit: ${GIT_COMMIT}"'
                sh 'ls -la'
                sh 'ls website/'
            }
        }

        // ── STAGE 2: Validate HTML (acts as our "Test" stage) ─
        stage('Validate') {
            steps {
                sh '''
                    echo "🔍 Checking that required HTML files exist..."
                    
                    # Verify all 5 website pages are present
                    for page in index.html menu.html about.html contact.html gallery.html; do
                        if [ -f "website/$page" ]; then
                            echo "  ✅ $page - FOUND"
                        else
                            echo "  ❌ $page - MISSING"
                            exit 1
                        fi
                    done
                    
                    echo "✅ All validation checks passed!"
                '''
            }
        }

        // ── STAGE 3: Docker Build ─────────────────────────────
        stage('Docker Build') {
            steps {
                sh """
                    echo "🐳 Building Docker image..."
                    docker build \\
                        --label build.number=${BUILD_NUMBER} \\
                        --label git.commit=${GIT_COMMIT} \\
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \\
                        -t ${IMAGE_NAME}:latest \\
                        .
                    echo "✅ Image built: ${IMAGE_NAME}:${IMAGE_TAG}"
                    docker images | grep restaurant-app
                """
            }
        }

        // ── STAGE 4: Push to Docker Hub ───────────────────────
        stage('Docker Push') {
            steps {
                sh """
                    echo "📤 Logging in to Docker Hub..."
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login \\
                        -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    
                    echo "📤 Pushing ${IMAGE_NAME}:${IMAGE_TAG}..."
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    
                    echo "📤 Pushing ${IMAGE_NAME}:latest..."
                    docker push ${IMAGE_NAME}:latest
                    
                    echo "✅ Image pushed to Docker Hub successfully!"
                """
            }
        }

        // ── STAGE 5: Deploy to EC2 ────────────────────────────
        stage('Deploy') {
            steps {
                sh """
                    echo "🚀 Deploying new version..."
                    
                    # Pull the new image (while old container still running)
                    docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                    
                    # Stop and remove old container (|| true = don't fail if not running)
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    
                    # Start new container
                    docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        -p ${APP_PORT}:80 \\
                        --restart=unless-stopped \\
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    
                    # Brief wait for container to start
                    sleep 5
                    
                    # Smoke test: verify website is responding
                    echo "🔍 Running smoke test..."
                    curl -sf http://localhost:${APP_PORT} | grep -i "html" || exit 1
                    echo "✅ Smoke test PASSED — website is live!"
                    echo "🌐 Site: http://\$(curl -s ifconfig.me)"
                """
            }
        }
    }

    // ── POST-PIPELINE ACTIONS ─────────────────────────────────
    post {
        always {
            // Clean up dangling Docker images to save disk space
            sh 'docker image prune -f || true'
            sh 'docker logout || true'
        }
        success {
            echo """
            ================================================
            ✅ PIPELINE SUCCEEDED — Build #${BUILD_NUMBER}
            Image: ${IMAGE_NAME}:${IMAGE_TAG}
            Website is LIVE on EC2!
            ================================================
            """
        }
        failure {
            echo """
            ================================================
            ❌ PIPELINE FAILED — Build #${BUILD_NUMBER}
            Check console output for error details.
            ================================================
            """
        }
    }
}