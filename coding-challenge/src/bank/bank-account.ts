import { v4 as uuid } from 'uuid';
import { ValidateErrorMessagesForAmountActions } from './interfaces'

export class BankAccount {
    private balance: number = 0;
    private accountHolder: string;
    private accountNumber: string;

    constructor(accountHolder) {
        this.accountHolder = accountHolder;
        this.accountNumber = uuid();
    }

    private validateRequestedAmount(
        amount: number,
        errorMessages: ValidateErrorMessagesForAmountActions
    ) {
        if (amount <= 0) {
            throw new Error(errorMessages.amountHasToBeGreaterThanZero);
        }

        if (this.balance <= amount) {
            throw new Error(errorMessages.insufficientFounds);
        }
    }

    private validateWithdraw(withdrawAmount: number) {
        const errorMessages: ValidateErrorMessagesForAmountActions = {
            amountHasToBeGreaterThanZero: 'Withdraw amount has to be greater than 0!',
            insufficientFounds: 'Insufficient funds!',
        };

        this.validateRequestedAmount(withdrawAmount, errorMessages);
    }

    private validateTransferAmount(transferAmount: number) {
        const errorMessages: ValidateErrorMessagesForAmountActions = {
            amountHasToBeGreaterThanZero: 'Deposit amount has to be greater than 0" error!',
            insufficientFounds: 'Insufficient funds!',
        };

        this.validateRequestedAmount(transferAmount, errorMessages);
    }

    withdraw(withdrawAmount: number) {
        this.validateWithdraw(withdrawAmount);

        this.balance -= withdrawAmount;
    }

    deposit(depositAmount: number) {
        this.balance += depositAmount;
    }

    checkBalance() {
        return this.balance;
    }

    transfer(transferAmount: number, destinationBankAccount: BankAccount) {
        // This method should take a sum out of the source account and transfer it to the destination bank account.
        this.validateTransferAmount(transferAmount);

        this.withdraw(transferAmount)
        try {
            destinationBankAccount.deposit(transferAmount)
        } catch (error) {
            this.deposit(transferAmount)
            throw new Error('Transfer have failed!')
        }
    }
}
