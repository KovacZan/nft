import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { AuctionsController } from "../controllers/auctions";

export const register = (server: Hapi.Server): void => {
    const controller = server.app.app.resolve(AuctionsController);
    server.bind(controller);

    server.route({
        method: "GET",
        path: "/auctions",
        handler: controller.index,
        options: {
            validate: {
                query: Joi.object({
                    ...server.app.schemas.pagination,
                    ...{
                        orderBy: server.app.schemas.orderBy,
                        transform: Joi.bool().default(true),
                    },
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/auctions/{id}",
        handler: controller.show,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().hex().length(64),
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/auctions/{id}/wallets",
        handler: controller.showAuctionWallet,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().hex().length(64),
                }),
            },
        },
    });

    server.route({
        method: "POST",
        path: "/auctions/search",
        handler: controller.search,
        options: {
            validate: {
                query: Joi.object({
                    ...server.app.schemas.pagination,
                    orderBy: server.app.schemas.orderBy,
                }),
                payload: Joi.object({
                    senderPublicKey: Joi.string().hex().length(66).optional(),
                    nftIds: Joi.array().items(Joi.string().hex().length(64)).optional(),
                    startAmount: Joi.string().optional(),
                    expiration: Joi.object({
                        blockHeight: Joi.number().positive(),
                    }),
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/auctions/canceled",
        handler: controller.indexCanceled,
        options: {
            validate: {
                query: Joi.object({
                    ...server.app.schemas.pagination,
                    orderBy: server.app.schemas.orderBy,
                    transform: Joi.bool().default(true),
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/auctions/canceled/{id}",
        handler: controller.showAuctionCanceled,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().hex().length(64),
                }),
            },
        },
    });
};
