package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import com.hakimmabike.bankingbackend.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory, Long> {
    // find all categories by type
    List<TransactionCategory> findByCategoryType(CategoryType type);

    // finds all categories that are system categories
    @Query("SELECT tc FROM TransactionCategory tc WHERE tc.isSystem = true")
    List<TransactionCategory> findByIsSystem();

    // finds all categories that are not system categories
    @Query("SELECT tc FROM TransactionCategory tc WHERE tc.isSystem = false")
    List<TransactionCategory> findByIsNotSystem();

    @Query("SELECT tc FROM TransactionCategory tc WHERE tc.name = :name")
    Optional<TransactionCategory> findByName(String name);
}
