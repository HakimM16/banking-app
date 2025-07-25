-- transaction_categories
ALTER TABLE transaction_categories
	DROP COLUMN category_type;

ALTER TABLE transaction_categories
	ADD COLUMN category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('INCOME', 'EXPENSE', 'TRANSFER'));

