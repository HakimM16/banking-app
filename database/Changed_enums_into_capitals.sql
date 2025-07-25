-- Users
ALTER TABLE users
	DROP COLUMN status;

ALTER TABLE users
	ADD COLUMN status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'));

-- transaction_categories
ALTER TABLE transaction_categories
	DROP COLUMN category_type;

ALTER TABLE transaction_categories
	ADD COLUMN category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('DEBIT', 'CREDIT', 'TRANSFER'));

-- accounts
ALTER TABLE accounts
	DROP COLUMN account_type,
	DROP COLUMN status;

ALTER TABLE accounts
	ADD COLUMN account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('DEBIT', 'SAVINGS', 'CREDIT')),
	ADD COLUMN status VARCHAR(50) NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'FROZEN'));

-- Transactions
ALTER TABLE transactions
	DROP COLUMN transaction_type,
	DROP COLUMN status;

ALTER TABLE transactions
	ADD COLUMN transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')),
	ADD COLUMN status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'));

-- Transfers
ALTER TABLE transfers
	DROP COLUMN status;

ALTER TABLE transfers
	ADD COLUMN status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'));

