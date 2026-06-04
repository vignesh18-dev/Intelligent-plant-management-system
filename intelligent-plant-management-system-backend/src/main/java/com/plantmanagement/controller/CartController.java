package com.plantmanagement.controller;

import com.plantmanagement.entity.CartItem;
import com.plantmanagement.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
})
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET ALL CART ITEMS FOR A USER
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartForUser(userId));
    }

    // ADD ITEM TO CART
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable Long userId,
            @RequestBody CartItemDto dto
    ) {
        CartItem saved = cartService.addItem(
                new CartItem(
                        dto.getPlantId(),
                        dto.getPlantName(),
                        dto.getPrice(),
                        dto.getQuantity(),
                        userId
                )
        );
        return ResponseEntity.ok(saved);
    }

    // UPDATE QUANTITY
    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItem> updateItem(
            @PathVariable Long itemId,
            @RequestBody UpdateQtyDto dto
    ) {
        CartItem updated = cartService.updateItem(itemId, dto.getQuantity());
        return ResponseEntity.ok(updated);
    }

    // REMOVE ITEM
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.ok("Item removed");
    }

    // CLEAR CART FOR USER — REQUIRED FOR ORDER
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }

    // DTO CLASSES
    public static class CartItemDto {
        private Long plantId;
        private String plantName;
        private java.math.BigDecimal price;
        private Integer quantity;

        public Long getPlantId() { return plantId; }
        public void setPlantId(Long plantId) { this.plantId = plantId; }

        public String getPlantName() { return plantName; }
        public void setPlantName(String plantName) { this.plantName = plantName; }

        public java.math.BigDecimal getPrice() { return price; }
        public void setPrice(java.math.BigDecimal price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class UpdateQtyDto {
        private Integer quantity;

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}