package com.example.bank.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.bank.dto.CardRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Card;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.CardService;
import com.example.bank.service.UserService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;
    private final UserService userService;
    private final AccountRepository accountRepository;

    public CardController(CardService cardService, UserService userService, AccountRepository accountRepository) {
        this.cardService = cardService;
        this.userService = userService;
        this.accountRepository = accountRepository;
    }

    private Account getCurrentUserAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails userDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        User user = userService.findByEmail(userDetails.getUsername());
        return accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato"));
    }

    @GetMapping
    public ResponseEntity<List<Card>> getCards() {
        Account account = getCurrentUserAccount();
        List<Card> cards = cardService.getCards(account.getId());

        return ResponseEntity.ok(cards);
    }

    @PostMapping
    public ResponseEntity<Card> requestNewCard(@RequestBody CardRequest request) {
        Account account = getCurrentUserAccount();

        Card resultCard = cardService.addCard(account.getId(), request.getType(), request.getNetwork());
        return ResponseEntity.ok(resultCard);
    }

    @PutMapping("/{id}/freeze")
    public ResponseEntity<Card> freezeCard(@PathVariable("id") Long id) {
        Account account = getCurrentUserAccount();
        Card updatedCard = cardService.freezeCard(id, account.getId());
        return ResponseEntity.ok(updatedCard);
    }

    @PutMapping("/{id}/unfreeze")
    public ResponseEntity<Card> unfreezeCard(@PathVariable("id") Long id) {
        Account account = getCurrentUserAccount();
        Card updatedCard = cardService.unfreezeCard(id, account.getId());
        return ResponseEntity.ok(updatedCard);
    }
}
