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

    private validateWithdraw(withdrawAmount: number) {
        if(withdrawAmount <= 0) {
            throw new Error('Withdraw amount has to be greater than 0!')
        }

        if( this.balance < withdrawAmount ) {
            throw new Error('Insufficient funds!')
        }
    }

    private validateDepositAmount(depositAmount: number) {
        if(depositAmount <= 0) {
            throw new Error('Deposit amount has to be greater than 0" error!')
        }
    }

    withdraw(withdrawAmount: number) {
        this.validateWithdraw(withdrawAmount);

        this.balance -= withdrawAmount;
    }

    deposit(depositAmount: number) {
        this.validateDepositAmount(depositAmount)

        this.balance += depositAmount;
    }

    checkBalance(): number {
        return this.balance;
    }

    transfer(transferAmount: number, destinationBankAccount: BankAccount) {
        // This method should take a sum out of the source account and transfer it to the destination bank account.
        this.withdraw(transferAmount)
        try {
            destinationBankAccount.deposit(transferAmount)
        } catch (error) {
            this.deposit(transferAmount)
            throw new Error(error)
        }
    }
}
