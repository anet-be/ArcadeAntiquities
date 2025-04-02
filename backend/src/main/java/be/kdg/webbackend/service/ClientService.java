package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Client;
import be.kdg.webbackend.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional
    public void createClient(String firstName, String lastName, String email) {
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format: " + email);
        }

        Client newClient = new Client(firstName, lastName, email);
        clientRepository.save(newClient);
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

}
