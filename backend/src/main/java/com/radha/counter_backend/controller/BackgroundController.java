package com.radha.counter_backend.controller;

import com.radha.counter_backend.entity.User;
import com.radha.counter_backend.entity.UserBackground;
import com.radha.counter_backend.repository.UserBackgroundRepository;
import com.radha.counter_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/backgrounds")
@CrossOrigin(origins = "*")
public class BackgroundController {

    @Autowired
    private UserBackgroundRepository backgroundRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}")
    @Transactional
    public ResponseEntity<?> uploadBackgrounds(@PathVariable Long userId, @RequestParam("files") MultipartFile[] files) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        backgroundRepository.deleteByUserId(userId);

        for (MultipartFile file : files) {
            try {
                UserBackground bg = new UserBackground();
                bg.setUser(user);
                bg.setImageData(file.getBytes());
                bg.setContentType(file.getContentType());
                backgroundRepository.save(bg);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Error uploading file");
            }
        }
        return ResponseEntity.ok("Uploaded successfully");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Long>> getUserBackgroundIds(@PathVariable Long userId) {
        List<Long> ids = backgroundRepository.findByUserId(userId)
                .stream().map(UserBackground::getId).collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        UserBackground bg = backgroundRepository.findById(id).orElse(null);
        if (bg == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(bg.getContentType()))
                .body(bg.getImageData());
    }
}
