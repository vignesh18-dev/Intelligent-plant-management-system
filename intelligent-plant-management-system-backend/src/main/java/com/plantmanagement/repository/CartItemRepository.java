package com.plantmanagement.repository;

import com.plantmanagement.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    @Transactional
    void deleteByUserId(Long userId); // ⭐ needed for clearCart
}