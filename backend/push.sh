#!/bin/bash

# Load environment variables
source .env

commit_message="Auto commit - $(date)"

git add .
git commit -m "$commit_message"
git push "$REPO_URL" $(git rev-parse --abbrev-ref HEAD)

echo "Changes pushed successfully!"
