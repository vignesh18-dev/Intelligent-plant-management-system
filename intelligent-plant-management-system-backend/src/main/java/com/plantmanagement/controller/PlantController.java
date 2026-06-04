package com.plantmanagement.controller;

import com.plantmanagement.entity.Plant;
import com.plantmanagement.service.PlantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
})// adapt origins if needed
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    // GET all
    @GetMapping
    public List<Plant> getAll() {
        return plantService.getAll();
    }

    // Add - uses form-data (multipart)
    @PostMapping("/add")
    public ResponseEntity<?> addPlant(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String price, // accept as string from form-data then convert
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            BigDecimal p = new BigDecimal(price);
            Plant saved = plantService.addPlant(name, description, p, image);
            return ResponseEntity.ok(saved);
        } catch (NumberFormatException nfe) {
            return ResponseEntity.badRequest().body("Invalid price");
        } catch (IOException ioe) {
            return ResponseEntity.internalServerError().body("Failed to save image: " + ioe.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Primary update route (matches recommended design)
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updatePlantPrimary(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String price,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            BigDecimal p = new BigDecimal(price);
            Plant updated = plantService.updatePlant(id, name, description, p, image);
            return ResponseEntity.ok(updated);
        } catch (NumberFormatException nfe) {
            return ResponseEntity.badRequest().body("Invalid price");
        } catch (IOException ioe) {
            return ResponseEntity.internalServerError().body("Failed to save image: " + ioe.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Primary delete route
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deletePlantPrimary(@PathVariable Long id) {
        try {
            plantService.deletePlant(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // --- Legacy mappings (so your frontend doesn't need to change) ---
    // Matches: /api/plants/admin/update/{id}
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> updatePlantLegacy(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String price,
            @RequestParam(required = false) MultipartFile image
    ) {
        return updatePlantPrimary(id, name, description, price, image);
    }

    // Matches: /api/plants/admin/delete/{id}
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deletePlantLegacy(@PathVariable Long id) {
        return deletePlantPrimary(id);
    }

    // Matches: /api/plants/admin/all  (if frontend calls this)
    @GetMapping("/admin/all")
    public List<Plant> getAllAdmin() {
        return plantService.getAll();
    }
}
