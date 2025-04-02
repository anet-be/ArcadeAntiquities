#!/bin/bash

# Give your git path from where to push
GIT_PAT=""  # Store securely!
# Give your git username
GIT_USERNAME=""
# Give your repo url
REPO_URL=""

commit_message="Auto commit - $(date)"

git add .
git commit -m "$commit_message"
git push "$REPO_URL" $(git rev-parse --abbrev-ref HEAD)

echo "Changes pushed successfully!"
