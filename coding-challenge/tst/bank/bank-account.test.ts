import { BankAccount } from "../../src/bank/bank-account";

describe('Tests for bank account class', () => {
    let bankAccount: BankAccount;
    const initialBalance = 12345;

    beforeEach(async () => {
        bankAccount = new BankAccount('UserBankAccount');
        bankAccount['balance'] = initialBalance;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    //#region CheckBalance

    it('should return account balance', () => {
        // Act
        const bankAccountBalance = bankAccount.checkBalance();

        // Assert
        expect(bankAccountBalance).toBe(initialBalance);
    });

    //#endregion

    //#region Withdraw

    it('should throw a "Withdraw amount has to be greater than 0!" error!', () => {
        // Arrange
        const withdrawAmount = -5;

        // Act & Assert
        expect(() => {
            bankAccount.withdraw(withdrawAmount)
        }).toThrow('Withdraw amount has to be greater than 0!');
    });

    it('should throw a "Insufficient funds!" error', () => {
        // Act & Assert
        expect(() => {
            bankAccount.withdraw(initialBalance + 1)
        }).toThrow('Insufficient funds!');
    });

    it('should withdraw the specified amount and update the current balance', () => {
        const withdrawAmount = 5
        const expectedCurrentBalanceAfterWithdraw = initialBalance - withdrawAmount
        
        bankAccount.withdraw(withdrawAmount)

        expect(bankAccount['balance']).toEqual(expectedCurrentBalanceAfterWithdraw)
    });

    //#endregion

    //#region Deposit

    it('should throw a "Deposit amount has to be greater than 0" error!', () => {
        const transferAmount = -1
        const destinationBankAccount = new BankAccount('DestinationAccount')

        expect(() => { 
            bankAccount.transfer(transferAmount, destinationBankAccount)
        }).toThrow('Deposit amount has to be greater than 0" error!')
    });

    it('should update the account balance with the specified sum!', () => {
        const transferAmount = 5
        const destinationBankAccount = new BankAccount('DestinationAccount')
        const expectedCurrentBalanceAfterTransfer = initialBalance - transferAmount

        bankAccount.transfer(transferAmount, destinationBankAccount)

        expect(bankAccount['balance']).toEqual(expectedCurrentBalanceAfterTransfer)
    });

    //#endregion

    //#region Transfer

    it('should transfer the specified sum from the destination account to the source account!', () => {
        // Arrange
        const destinationAccount: BankAccount = new BankAccount('DestinationAccount');
        const transferAmount = 100;

        jest.spyOn(BankAccount.prototype, 'withdraw').mockImplementationOnce(() => {
            bankAccount['balance'] -= transferAmount;
        });

        jest.spyOn(BankAccount.prototype, 'deposit').mockImplementationOnce(() => {
            destinationAccount['balance'] = transferAmount;
        })

        // Act
        bankAccount.transfer(transferAmount, destinationAccount);

        // Assert
        expect(bankAccount['balance']).toBe(initialBalance - transferAmount);
        expect(destinationAccount['balance']).toBe(transferAmount);
    });

    it('should transfer the specified sum back to the source account if the deposit operation fails!', () => {
        const transferAmount = 5
        const destinationAccount = new BankAccount('DestinationAccount');
        const expectedCurrentBalanceAfterTransfer = initialBalance


        jest.spyOn(BankAccount.prototype, 'withdraw').mockImplementationOnce(() => {
            bankAccount['balance'] -= transferAmount;
        });
        jest.spyOn(BankAccount.prototype, 'deposit').mockImplementationOnce(() => {
            throw new Error('Transfer failed')
        })

        expect(() => {
            bankAccount.transfer(transferAmount, destinationAccount);
        }).toThrow('Transfer have failed!')
        expect(bankAccount['balance']).toBe(expectedCurrentBalanceAfterTransfer);
    });
    //#endregion
})