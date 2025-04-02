package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Asset;
import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.domain.ProjectVersion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class GitRepoService {
    private static final Logger logger = LoggerFactory.getLogger(GitRepoService.class);
    private final ProjectVersionService projectVersionService;
    private final AssetService assetService;
    private final ProjectService projectService;

    public GitRepoService(ProjectVersionService projectVersionService, AssetService assetService, ProjectService projectService) {
        this.projectVersionService = projectVersionService;
        this.assetService = assetService;
        this.projectService = projectService;
    }

    public void uploadProjectVersion(UUID projectVersionId) {
        ProjectVersion projectVersion = projectVersionService.getProjectVersion(projectVersionId);
        Project project = projectService.getProjectByProjectVersionId(projectVersion.getId());

        Set<Asset> assets = new HashSet<>();
        String pacmanName = null;
        String spaceInvaderName = null;

        for (GameVersion gameVersion : projectVersion.getGameVersions()) {
            assets.addAll(assetService.getAssetsOfGameVersion(gameVersion.getId()));

            if (gameVersion.getBaseGame().getName().equals("pac-man")) {
                pacmanName = gameVersion.getVersionName();
                pacmanName = pacmanName.replace(" ", "_");
            } else if (gameVersion.getBaseGame().getName().equals("space invaders")) {
                spaceInvaderName = gameVersion.getVersionName();
                spaceInvaderName = spaceInvaderName.replace(" ", "_");
            }
        }


        List<String> assetsUrl = assets.stream()
                .map(Asset::getUrl)
                .toList();

        String assetsString = String.join(",", assetsUrl);

        String projectName = project.getName();
        String branchName = String.format("%s", projectName.replace(" ", "_"));
        String scriptPath = "src/main/java/be/kdg/webbackend/script/CreateGameRepoBranch.py";
        String pythonExecutable = "/venv/bin/python3";
        String command = String.format("%s %s %s %s %s %s", pythonExecutable, scriptPath, assetsString, pacmanName, spaceInvaderName, branchName);

        try {
            logger.info("Starting to execute Python script for project: {}", project.getName());

            logger.info("Command: {}", command);
            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                logger.info(line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                logger.info("✅ Python script executed successfully for project with id: {}", project.getId());
            } else {
                logger.error("❌ Python script execution failed for project with id: {}. Exit code: {}", project.getId(), exitCode);
            }

        } catch (IOException | InterruptedException e) {
            logger.error("❌ Error occurred while executing the script for project with id: {}: {}", project.getId(), e.getMessage());
        }
    }


}
