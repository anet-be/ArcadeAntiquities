import os
import sys
import git
import logging
from pathlib import Path
import shutil
from dotenv import load_dotenv

# Set up logging for better error handling and debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

load_dotenv()

# Constants for file paths and configuration
GIT_REPO_URL = os.getenv("REPO_URL")


def validate_input():
    """Validates that the assets, projectVersionId, and projectName are passed as arguments."""
    if len(sys.argv) < 4:
        logger.error("Usage: python3 update_game_repo.py <assets> <pacmanName> <spaceInvaderName> <projectName>")
        sys.exit(1)

    assets_input = sys.argv[1]
    assets = [asset.strip() for asset in assets_input.split(",")]

    pacman_name = sys.argv[2]
    space_invader_name = sys.argv[3]
    projectName = sys.argv[4]

    if not assets:
        logger.error("assets cannot be empty")
        sys.exit(1)

    if not pacman_name:
        logger.error("pacman_name cannot be empty")
        sys.exit(1)

    if not projectName:
        logger.error("projectName cannot be empty")
        sys.exit(1)

    if not projectName:
        logger.error("projectName cannot be empty")
        sys.exit(1)

    return assets, pacman_name, space_invader_name, projectName


def setup_repo(projectName):
    """Always clones the repository, deleting any existing local copy first."""
    repo_path = Path(f'branches/{projectName}')

    # If the repository folder exists, delete it
    if repo_path.exists():
        logger.info(f"Deleting existing repository directory: {repo_path}")
        shutil.rmtree(repo_path)

    logger.info(f"Cloning repository into {repo_path}...")

    try:
        repo = git.Repo.clone_from(GIT_REPO_URL, repo_path, bare=False)
        logger.info("Repository cloned successfully.")
    except Exception as e:
        logger.error(f"Error cloning repo: {e}")
        sys.exit(1)

    return repo, repo_path


def create_or_checkout_branch(repo, projectName):
    """Creates a new branch or checks out the existing one."""
    branch_name = f"{projectName}"
    try:
        if branch_name not in repo.branches:
            logger.info(f"Creating new branch {branch_name}...")
            repo.git.checkout('-b', branch_name)
            logger.info(f"Branch {branch_name} created and checked out.")
        else:
            logger.info(f"Branch {branch_name} already exists, checking it out...")
            repo.git.checkout(branch_name)
    except Exception as e:
        logger.error(f"Error creating or checking out branch: {e}")
        sys.exit(1)

def clear_directory(directory_path):
    """Clear the contents of a directory."""
    try:
        for item in directory_path.iterdir():
            if item.is_dir():
                shutil.rmtree(item)  # Remove subdirectories
            else:
                item.unlink()  # Remove files
        logger.info(f"Cleared directory: {directory_path}")
    except Exception as e:
        logger.error(f"Error clearing directory {directory_path}: {e}")
        sys.exit(1)

def add_files_to_repo(assets, repo_path, pacman_name, space_invader_name, projectName):
    """Moves files to the repository and stages them for commit."""
    assets_dir = repo_path / 'assets'
    logger.info(f"Adding assets to repository {assets_dir}...")
    clear_directory(assets_dir)

    subdir_in_repo = repo_path / f'assets/{projectName}'
    subdir_in_repo.mkdir(parents=True, exist_ok=True)

    destination_path = subdir_in_repo / 'background.jpg'

    try:
        shutil.copy('static/assets/images/background.jpg', destination_path)
        logger.info(f"Copied static/assets/images/background.jpg to {destination_path}.")
    except Exception as e:
        logger.error(f"Error copying static/assets/images/background.jpg: {e}")
        sys.exit(1)

    for asset in assets:
        # Assuming the 'asset' is something like 'static/assets/pac-man/version_1/gameWin.wav'
        asset_path = Path(f"static{asset}")

        if asset_path.exists():
            # Extract only the 'pac-man' part from the asset path
            # This assumes the structure is always like 'static/assets/{subdir}/...'
            if asset_path.parts[2] == 'space_invaders-base-game':
                subdir_in_repo = repo_path / 'assets' / space_invader_name
            elif asset_path.parts[2] == 'pac-man-base-game':
                subdir_in_repo = repo_path / 'assets' / pacman_name

            # Create the necessary directories in the repository if they don't exist
            subdir_in_repo.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory {subdir_in_repo}.")

            # Define the final destination path (where the file should go in the repo)
            destination_path = subdir_in_repo / asset_path.name

            try:
                shutil.copy(asset_path, destination_path)
                logger.info(f"Copied {asset_path} to {destination_path}.")
            except Exception as e:
                logger.error(f"Error copying {asset_path}: {e}")
                sys.exit(1)
        else:
            logger.warning(f"Asset {asset_path} does not exist.")

    repo = git.Repo(repo_path)
    repo.git.add('--all')
    logger.info("Files staged for commit.")


def commit_and_push_changes(repo, projectName):
    try:
        if repo.is_dirty(untracked_files=True):
            repo.git.commit('-m', f"Added assets for {projectName}")
            logger.info("Changes committed.")
        else:
            logger.info("No changes to commit.")

        repo.git.push("origin", projectName, force=True)
        logger.info("Changes pushed to remote.")
    except Exception as e:
        logger.error(f"Error committing or pushing changes: {e}")
        sys.exit(1)

def cleanup_local_files():
    """Completely deletes the repository directory, including all files and subdirectories."""
    repo_path = Path(f'branches')
    try:
        if repo_path.exists():
            shutil.rmtree(repo_path)  # Completely remove the directory
            logger.info(f"Deleted repository directory: {repo_path}")
        else:
            logger.info(f"Repository directory {repo_path} does not exist, skipping cleanup.")
    except Exception as e:
        logger.error(f"Error deleting repository directory: {e}")
        sys.exit(1)


def main():
    assets, pacman_name, space_invader_name, projectName = validate_input()

    repo, repo_path = setup_repo(projectName)

    create_or_checkout_branch(repo, projectName)

    add_files_to_repo(assets, repo_path, pacman_name, space_invader_name, projectName)

    commit_and_push_changes(repo, projectName)

    cleanup_local_files()


if __name__ == "__main__":
    main()