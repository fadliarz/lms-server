"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUpdateOn = void 0;
exports.PrismaUpdateOn = {
    course: {
        event: {
            createLike: {
                totalLikes: {
                    increment: 1,
                },
            },
            deleteLike: {
                totalLikes: {
                    decrement: 1,
                },
            },
        },
    },
};
