package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.transactionCategory.CreateTransactionCategoryRequest;
import com.hakimmabike.bankingbackend.dto.transactionCategory.TransactionCategoryDto;
import com.hakimmabike.bankingbackend.enums.CategoryType;
import com.hakimmabike.bankingbackend.repository.TransactionCategoryRepository;
import com.hakimmabike.bankingbackend.services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller is only used on Postman

@RestController
@AllArgsConstructor
@RequestMapping("/api/transaction-categories")
public class TransactionCategoryController {
    private final TransactionService transactionService;
    private final TransactionCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<TransactionCategoryDto>> getAllTransactionCategories() {
        List<TransactionCategoryDto> categories = transactionService.getAllTransactionCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getTransactionCategory(@PathVariable String name) {
        // check if name exists
        if (!transactionService.categoryExists(name)) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body("Category not found");
        }
        TransactionCategoryDto category = transactionService.getTransactionCategory(name);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<?> createTransactionCategory(@RequestBody CreateTransactionCategoryRequest request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Name can't be empty");
        }

        if (categoryRepository.existsByName(request.getName())) {
            return ResponseEntity.status(409).body("Category already exists");
        }

        if (!CategoryType.isValidCategoryType(request.getCategoryType())) {

            return ResponseEntity.badRequest().body("Category type is invalid: " + request.getCategoryType());
        }

        TransactionCategoryDto createdCategory = transactionService.createTransactionCategory(request);
        return ResponseEntity.status(201).body(createdCategory);
    }
}
