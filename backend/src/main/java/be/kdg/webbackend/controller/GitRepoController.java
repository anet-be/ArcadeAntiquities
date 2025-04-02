package be.kdg.webbackend.controller;

import be.kdg.webbackend.service.GitRepoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/git-repos")
public class GitRepoController {

    private final GitRepoService gitRepoService;

    public GitRepoController(GitRepoService gitRepoService) {
        this.gitRepoService = gitRepoService;
    }

    @PostMapping("/upload-project")
    public ResponseEntity<String> uploadProject(@RequestParam("projectVersionId") UUID projectVersionId) {
        gitRepoService.uploadProjectVersion(projectVersionId);
        return ResponseEntity.ok("game repository successfully created");
    }
}
