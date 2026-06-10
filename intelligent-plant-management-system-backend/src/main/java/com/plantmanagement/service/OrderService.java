package com.plantmanagement.service;

import com.plantmanagement.dto.OrderItemDto;
import com.plantmanagement.dto.OrderRequestDto;
import com.plantmanagement.entity.Order;
import com.plantmanagement.entity.OrderItem;
import com.plantmanagement.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repo;
    private final CartService cartService;

    public OrderService(OrderRepository repo, CartService cartService) {
        this.repo = repo;
        this.cartService = cartService;
    }

    public Order placeOrder(OrderRequestDto dto) {

        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setTotalPrice(dto.getTotalPrice());

        List<OrderItem> items = dto.getItems()
                .stream()
                .map(i -> new OrderItem(
                        i.getPlantId(),
                        i.getQuantity(),
                        i.getPrice(),
                        order
                ))
                .toList();

        order.setItems(items);

        Order savedOrder = repo.save(order);
        
        // Clear the user's cart after successfully placing the order
        cartService.clearCart(dto.getUserId());
        
        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }
}