import "jest-extended";

import { Application } from "@arkecosystem/core-kernel";
import { initApp, ItemResponse } from "../__support__";
import { Identifiers } from "@arkecosystem/core-kernel/src/ioc";
import { Transactions as NFTTransactions } from "@protokol/nft-base-crypto";
import { Generators } from "@arkecosystem/core-test-framework/src";
import { configManager } from "@arkecosystem/crypto/src/managers";
import { Managers, Transactions } from "@arkecosystem/crypto";
import { ConfigurationController } from "../../../src/controllers/configurations";
import { Defaults as CryptoDefaults } from "@protokol/nft-base-crypto";
import { Defaults as TransactionsDefaults } from "@protokol/nft-base-transactions";

let app: Application;

let configurationsController: ConfigurationController;

const transactionHistoryService = {
    findManyByCriteria: jest.fn(),
    findOneByCriteria: jest.fn(),
    listByCriteria: jest.fn(),
};

beforeEach(() => {
    const config = Generators.generateCryptoConfigRaw();
    configManager.setConfig(config);
    Managers.configManager.setConfig(config);

    app = initApp();

    transactionHistoryService.findManyByCriteria.mockReset();
    transactionHistoryService.findOneByCriteria.mockReset();
    transactionHistoryService.listByCriteria.mockReset();

    app.bind(Identifiers.TransactionHistoryService).toConstantValue(transactionHistoryService);

    configurationsController = app.resolve<ConfigurationController>(ConfigurationController);
});

afterEach(() => {
    Transactions.TransactionRegistry.deregisterTransactionType(NFTTransactions.NFTRegisterCollectionTransaction);
    Transactions.TransactionRegistry.deregisterTransactionType(NFTTransactions.NFTCreateTransaction);
    Transactions.TransactionRegistry.deregisterTransactionType(NFTTransactions.NFTTransferTransaction);
    Transactions.TransactionRegistry.deregisterTransactionType(NFTTransactions.NFTBurnTransaction);
});

describe("Test configurations controller", () => {
    it("index - return package name and version and crypto and transactions default settings", async () => {
        const response = (await configurationsController.index(undefined, undefined)) as ItemResponse;
        expect(response.data).toStrictEqual({
            package: {
                name: require("../../../package.json").name,
                version: require("../../../package.json").version,
            },
            crypto: {
                ...CryptoDefaults,
            },
            transactions: {
                ...TransactionsDefaults,
            },
        });
    });
});