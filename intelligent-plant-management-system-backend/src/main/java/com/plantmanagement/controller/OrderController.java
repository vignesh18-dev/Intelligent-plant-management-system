package com.plantmanagement.controller;

import com.plantmanagement.dto.OrderRequestDto;
import com.plantmanagement.entity.Order;
import com.plantmanagement.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
})
public class OrderController {

    private final OrderService service;
    private final Logger log = LoggerFactory.getLogger(OrderController.class);

    public OrderController(OrderService service) {
        this.service = service;
    }

    /**
     * Place an order.
     * Returns 201 Created with saved Order.
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequestDto dto) {
        try {
            Order saved = service.placeOrder(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception ex) {
            log.error("Error placing order", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to place order: " + ex.getMessage());
        }
    }

    /**
     * Get orders for a specific user.
     * Returns 200 OK and a (possibly empty) list.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> userOrders(@PathVariable Long userId) {
        List<Order> list = service.getOrdersByUser(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Admin: get all orders.
     * Returns 200 OK and a (possibly empty) list.
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> allOrders() {
        List<Order> list = service.getAllOrders();
        return ResponseEntity.ok(list);
    }
}