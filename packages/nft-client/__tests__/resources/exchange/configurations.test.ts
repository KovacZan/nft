import "jest-extended";

import { Configurations } from "../../../src/resources/exchange/configurations";
import { configureExchangeMocks } from "../../mocks/exchange";

const resource: Configurations = configureExchangeMocks<Configurations>(Configurations);

describe("API - 1.0 - Exchange/Resources - Configurations", () => {
    it('should call \\"index\\" method', async () => {
        const response = await resource.index();

        expect(response.status).toBe(200);

        // Package responses
        expect(response.body.data.package.name).toBe("@protokol/nft-exchange-api");
        expect(response.body.data.package.currentVersion).toBe("1.0.0");
        expect(response.body.data.package.latestVersion).toBe("1.0.0");

        // Crypto
        expect(response.body.data.crypto.defaults.nftExchangeTypeGroup).toStrictEqual(9001);
        expect(response.body.data.crypto.defaults.nftAuction.minItems).toStrictEqual(1);
        expect(response.body.data.crypto.defaults.nftAuction.maxItems).toStrictEqual(10);

        // Transactions
        expect(response.body.data.transactions.defaults.feeType).toStrictEqual(0);
    });
});