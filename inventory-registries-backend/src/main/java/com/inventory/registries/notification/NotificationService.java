package com.inventory.registries.notification;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    // create notification for ONE user
    public void send(
            String username,
            String title,
            String message,
            NotificationType type,
            String referenceType,
            Long referenceId
    ) {
        Notification n = new Notification();
        n.setRecipientUsername(username);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setReferenceType(referenceType);
        n.setReferenceId(referenceId);
        repo.save(n);
    }

    // fetch logged-in user's notifications
    public List<Notification> myNotifications(String username) {
        return repo.findByRecipientUsernameOrderByCreatedAtDesc(username);
    }

    public void markRead(Long id) {
        repo.findById(id).ifPresent(n -> {
            n.setRead(true);
            repo.save(n);
        });
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    public List<Notification> getMyNotifications() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return repo.findByRecipientUsernameOrderByCreatedAtDesc(username);
    }

}


