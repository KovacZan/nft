import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { CollectionsController } from "../controllers/collections";

export const register = (server: Hapi.Server): void => {
    const controller = server.app.app.resolve(CollectionsController);
    server.bind(controller);

    server.route({
        method: "GET",
        path: "/collections",
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
        path: "/collections/{id}",
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
        path: "/collections/{id}/schema",
        handler: controller.showSchema,
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
        path: "/collections/{id}/wallets",
        handler: controller.showByWalletId,
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
        path: "/collections/search",
        handler: controller.searchCollection,
        options: {
            validate: {
                query: Joi.object({
                    ...server.app.schemas.pagination,
                    orderBy: server.app.schemas.orderBy,
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/collections/{id}/assets",
        handler: controller.showAssetsByCollectionId,
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
};