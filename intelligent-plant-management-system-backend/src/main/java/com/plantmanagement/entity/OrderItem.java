package com.plantmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long plantId;

    private Integer quantity;

    private BigDecimal price;

    import com.fasterxml.jackson.annotation.JsonIgnore;

@ManyToOne
@JoinColumn(name = "order_id")
@JsonIgnore
private Order order;

    public OrderItem() {}

    public OrderItem(Long plantId, Integer quantity, BigDecimal price, Order order) {
        this.plantId = plantId;
        this.quantity = quantity;
        this.price = price;
        this.order = order;
    }

    // getters & setters
    public Long getId() { return id; }

    public Long getPlantId() { return plantId; }
    public void setPlantId(Long plantId) { this.plantId = plantId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}