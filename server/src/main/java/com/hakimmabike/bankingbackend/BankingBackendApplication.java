package com.hakimmabike.bankingbackend;

import com.hakimmabike.bankingbackend.entity.*;
import com.hakimmabike.bankingbackend.enums.*;
import com.hakimmabike.bankingbackend.services.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootApplication
public class BankingBackendApplication {

	public static void main(String[] args) {

		var context = SpringApplication.run(BankingBackendApplication.class, args);
		//testUserAndAccountCreation();
		//testTransactionsAndTransfers();
//		testAccountTransactions();
//		testSaveUser(context);

	}

	public static void testUserAndAccountCreation() {
		// Create a user and accounts to test the application
		var user = User.builder()
				.email("hakim@gmail.com")
				.password("password")
				.firstName("Hakim")
				.lastName("Mabike")
				.phoneNumber("1234567890")
				.status(UserStatus.valueOf("ACTIVE"))
				.build();

		var account = Account.builder()
				.accountNumber("123456789")
				.accountType(AccountType.valueOf("SAVINGS"))
				.balance(BigDecimal.valueOf(1000.0))
				.status(AccountStatus.OPEN)
				.build();
		user.addAccount(account);


		var account2 = Account.builder()
				.accountNumber("987654321")
				.accountType(AccountType.valueOf("DEBIT"))
				.balance(BigDecimal.valueOf(500.0))
				.status(AccountStatus.OPEN)
				.build();

		user.addAccount(account2);

		account.setUser(user);
		account2.setUser(user);

		System.out.println("User: " + user);
		System.out.println("Accounts: " + user.getAccounts());
	}

	public static void testUserAddressAndAccountCreation() {
		// Create user with address
		User user = User.builder()
				.email("hakim@gmail.com")
				.password("password123")
				.firstName("Hakim")
				.lastName("Mabike")
				.phoneNumber("1234567890")
				.status(UserStatus.ACTIVE)
				.build();

		UserAddress address = UserAddress.builder()
				.street("123 Main St")
				.city("London")
				.county("Greater London")
				.postCode("SW1A 1AA")
				.country("UK")
				.user(user)
				.build();

		user.setUserAddress(address);

		// Create accounts
		Account savingsAccount = Account.builder()
				.accountNumber("123456789")
				.accountType(AccountType.SAVINGS)
				.balance(BigDecimal.valueOf(1000.0))
				.status(AccountStatus.OPEN)
				.build();

		Account debitAccount = Account.builder()
				.accountNumber("987654321")
				.accountType(AccountType.DEBIT)
				.balance(BigDecimal.valueOf(500.0))
				.status(AccountStatus.OPEN)
				.build();

		// Add accounts to user
		user.addAccount(savingsAccount);
		user.addAccount(debitAccount);

		// Create transaction categories
		TransactionCategory incomeCategory = TransactionCategory.builder()
				.name("Salary")
				.description("Monthly income")
				.categoryType(CategoryType.INCOME)
				.isSystem(true)
				.build();

		TransactionCategory expenseCategory = TransactionCategory.builder()
				.name("Shopping")
				.description("Retail purchases")
				.categoryType(CategoryType.EXPENSE)
				.isSystem(true)
				.build();

		// Print statements
		System.out.println("Number of user accounts: " + user.getAccounts().size());
		System.out.println("User email: " + user.getEmail());
		System.out.println("User city: " + user.getUserAddress().getCity());
		System.out.println("Savings account balance: " + savingsAccount.getBalance());
		System.out.println("Debit account balance: " + debitAccount.getBalance());
		System.out.println("Income category is system: " + incomeCategory.isSystem());
		System.out.println("Expense category type: " + expenseCategory.getCategoryType());
	}

	public static void testTransactionsAndTransfers() {
		// Create user and accounts
		User user = User.builder()
				.email("hakim@gmail.com")
				.password("password123")
				.firstName("Hakim")
				.lastName("Mabike")
				.phoneNumber("1234567890")
				.status(UserStatus.ACTIVE)
				.build();

		Account sourceAccount = Account.builder()
				.accountNumber("123456789")
				.accountType(AccountType.SAVINGS)
				.balance(BigDecimal.valueOf(1000.0))
				.status(AccountStatus.OPEN)
				.build();

		Account destinationAccount = Account.builder()
				.accountNumber("987654321")
				.accountType(AccountType.DEBIT)
				.balance(BigDecimal.valueOf(500.0))
				.status(AccountStatus.OPEN)
				.build();

		// Set up bidirectional relationships
		sourceAccount.setUser(user);
		destinationAccount.setUser(user);
		user.addAccount(sourceAccount);
		user.addAccount(destinationAccount);

		// Create transaction categories
		TransactionCategory transferCategory = TransactionCategory.builder()
				.name("Transfer")
				.description("Account to Account Transfer")
				.categoryType(CategoryType.TRANSFER)
				.isSystem(true)
				.build();

		// Create a transfer
		Transfer transfer = Transfer.builder()
				.senderAccount(sourceAccount)
				.receiverAccount(destinationAccount)
				.amount(BigDecimal.valueOf(200.0))
				.status(TransactionStatus.PENDING)
				.description("Transfer from savings to debit")
				.build();

		// Create transactions for the transfer
		Transaction debitTransaction = Transaction.builder()
				.account(sourceAccount)
				.amount(BigDecimal.valueOf(-200.0))
				.balanceAfterTransaction(sourceAccount.getBalance().subtract(BigDecimal.valueOf(500.0)).doubleValue())
				.transactionCategory(transferCategory)
				.description("Transfer to " + destinationAccount.getAccountNumber())
				.status(TransactionStatus.COMPLETED)
				.transactionType(String.valueOf(TransactionType.TRANSFER))  // Add transaction type if required
				.build();

		Transaction creditTransaction = Transaction.builder()
				.account(destinationAccount)
				.amount(BigDecimal.valueOf(200.0))
				.balanceAfterTransaction(destinationAccount.getBalance().add(BigDecimal.valueOf(200.0)).doubleValue())
				.transactionCategory(transferCategory)
				.description("Transfer from " + sourceAccount.getAccountNumber())
				.status(TransactionStatus.COMPLETED)
				.transactionType(String.valueOf(TransactionType.TRANSFER))  // Add transaction type if required
				.build();

		System.out.println(sourceAccount);
		// Print statements to verify the setup
		System.out.println("Initial source account balance: " + sourceAccount.getBalance());
		System.out.println("Initial destination account balance: " + destinationAccount.getBalance());
		System.out.println("Transfer amount: " + transfer.getAmount());
		System.out.println("Transfer status: " + transfer.getStatus());
		System.out.println("Debit transaction amount: " + debitTransaction.getAmount());
		System.out.println("Credit transaction amount: " + creditTransaction.getAmount());
		System.out.println("Transaction category: " + transferCategory.getName());
	}

	public static void testAccountTransactions() {
		// Create an account
		Account account = Account.builder()
				.accountNumber("123456789")
				.accountType(AccountType.SAVINGS)
				.balance(BigDecimal.valueOf(1000.0))
				.status(AccountStatus.OPEN)
				.build();

		// Create transaction categories
		TransactionCategory salaryCategory = TransactionCategory.builder()
				.name("Salary")
				.description("Monthly salary deposit")
				.categoryType(CategoryType.INCOME)
				.isSystem(true)
				.build();

		TransactionCategory billsCategory = TransactionCategory.builder()
				.name("Bills")
				.description("Monthly utilities")
				.categoryType(CategoryType.EXPENSE)
				.isSystem(true)
				.build();

		// Create transactions
		Transaction salaryDeposit = Transaction.builder()
				.account(account)
				.transactionNumber("DEP-001")
				.transactionType(String.valueOf(TransactionType.DEPOSIT))
				.amount(BigDecimal.valueOf(2500.0))
				.balanceAfterTransaction(account.getBalance().add(BigDecimal.valueOf(2500.0)).doubleValue())
				.description("Monthly salary deposit")
				.status(TransactionStatus.COMPLETED)
				.transactionDate(LocalDateTime.now())
				.transactionCategory(salaryCategory)
				.build();

		Transaction billPayment = Transaction.builder()
				.account(account)
				.transactionNumber("BILL-001")
				.transactionType(String.valueOf(TransactionType.WITHDRAWAL))
				.amount(BigDecimal.valueOf(-150.0))
				.balanceAfterTransaction(account.getBalance().subtract(BigDecimal.valueOf(150.0)).doubleValue())
				.description("Electricity bill payment")
				.status(TransactionStatus.COMPLETED)
				.transactionDate(LocalDateTime.now())
				.transactionCategory(billsCategory)
				.build();

		// Print statements to verify the setup
		System.out.println("Account Details:");
		System.out.println("Account Number: " + account.getAccountNumber());
		System.out.println("Initial Balance: " + account.getBalance());
		System.out.println("\nTransaction Categories:");
		System.out.println("Category 1: " + salaryCategory.getName() + " (System: " + salaryCategory.isSystem() + ")");
		System.out.println("Category 2: " + billsCategory.getName() + " (System: " + billsCategory.isSystem() + ")");
		System.out.println("\nTransactions:");
		System.out.println("Salary Deposit - Amount: " + salaryDeposit.getAmount() +
				", Balance After: " + salaryDeposit.getBalanceAfterTransaction() +
				", Type: " + salaryDeposit.getTransactionType());
		System.out.println("Bill Payment - Amount: " + billPayment.getAmount() +
				", Balance After: " + billPayment.getBalanceAfterTransaction() +
				", Type: " + billPayment.getTransactionType());
	}

	public static void testSaveUser(ConfigurableApplicationContext context) {
		// Create a user
		User user = User.builder()
				.email("Patrick@gmail.com")
				.password("password")
				.firstName("Patrick")
				.lastName("Star")
				.phoneNumber("07965047732")
				.status(UserStatus.valueOf("ACTIVE"))
				.build();

		var service = context.getBean(UserService.class);
//		service.registerUser(user);
	}
}
