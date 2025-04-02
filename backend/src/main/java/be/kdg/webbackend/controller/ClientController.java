package be.kdg.webbackend.controller;

import be.kdg.webbackend.dtos.requests.AddClientRequest;
import be.kdg.webbackend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<String> addClient(@Valid @RequestBody AddClientRequest addClientRequest) {
        try {
            clientService.createClient(addClientRequest.firstName(), addClientRequest.lastName(), addClientRequest.email());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Client added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred: " + e.getMessage());
        }
    }

}
