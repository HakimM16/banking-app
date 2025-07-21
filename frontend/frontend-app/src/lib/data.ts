// src/lib/data.ts
// This simulates your backend data storage

// --- Simulated API functions ---

export async function getUserByUsernamePassword(username: string, password: string): Promise<User | undefined> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.find(u => u.username === username && u.password === password);
}

export async function getUserByUserId(userId: number): Promise<User | undefined> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return users.find(u => u.id === userId);
}

export async function registerNewUser(userData: RegisterFormInputs): Promise<{ success: boolean; message?: string; user?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    if (users.find(u => u.username === userData.username)) {
        return { success: false, message: 'Username already exists!' };
    }
    const newUser: User = {
        id: users.length + 1,
        ...userData,
        accounts: []
    };
    users.push(newUser);
    return { success: true, user: newUser };
}

export async function getUserAccounts(userId: number): Promise<Account[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = users.find(u => u.id === userId);
    return user ? user.accounts : [];
}

export async function toggleAccountStatusInDB(userId: number, accountId: string): Promise<{ success: boolean; message?: string; updatedUser?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { success: false, message: 'User not found' };

    const accountIndex = users[userIndex].accounts.findIndex(acc => acc.id === accountId);
    if (accountIndex === -1) return { success: false, message: 'Account not found' };

    const currentStatus = users[userIndex].accounts[accountIndex].status;
    users[userIndex].accounts[accountIndex].status = currentStatus === 'active' ? 'inactive' : 'active';
    return { success: true, updatedUser: users[userIndex] };
}

export async function getUserTransactions(userId: number): Promise<Transaction[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return transactions.filter(t => t.userId === userId);
}

export async function addTransaction(transactionData: Omit<Transaction, 'id' | 'date' | 'status'>): Promise<{ success: boolean; message?: string; transaction?: Transaction }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        ...transactionData
    };
    transactions.push(newTransaction);
    return { success: true, transaction: newTransaction };
}

export async function updateAccountBalances(userId: number, fromAccountId: string | null, toAccountId: string | null, amount: number, type: 'transfer' | 'deposit' | 'withdrawal'): Promise<{ success: boolean; message?: string; updatedUser?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { success: false, message: 'User not found' };

    const user = users[userIndex];

    if (fromAccountId) {
        const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);
        if (!fromAccount) { // Account not found in user's accounts
            return { success: false, message: 'Invalid source account.' };
        }
        if (fromAccount.balance < amount) {
            return { success: false, message: 'Insufficient funds in source account.' };
        }
        fromAccount.balance -= amount;
    }

    if (toAccountId) {
        const toAccount = user.accounts.find(acc => acc.id === toAccountId);
        if (!toAccount) { // Account not found in user's accounts
            return { success: false, message: 'Invalid destination account.' };
        }
        toAccount.balance += amount;
    }

    // Ensure balance updates are reflected in the global users object
    users[userIndex] = { ...user, accounts: [...user.accounts] };

    return { success: true, updatedUser: users[userIndex] };
}

export async function updateUserData(userId: number, newData: Partial<ProfileFormInputs>): Promise<{ success: boolean; message?: string; updatedUser?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    users[userIndex] = { ...users[userIndex], ...newData };
    return { success: true, updatedUser: users[userIndex] };
}