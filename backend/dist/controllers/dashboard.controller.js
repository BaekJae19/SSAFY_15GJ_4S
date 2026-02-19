"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDdayEvent = exports.getUpcomingEvents = exports.getTodayMenu = exports.getTodayKnowledge = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getTodayKnowledge = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const knowledge = await prisma_1.default.dailyKnowledge.findFirst({
            where: {
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        if (!knowledge) {
            // Return a default or a random one if today's is not set
            const randomKnowledge = await prisma_1.default.dailyKnowledge.findFirst();
            return res.status(200).json(randomKnowledge);
        }
        res.status(200).json(knowledge);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTodayKnowledge = getTodayKnowledge;
const getTodayMenu = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const menus = await prisma_1.default.menu.findMany({
            where: {
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        // Parse items from JSON string back to array
        const formattedMenus = menus.map(menu => ({
            ...menu,
            items: JSON.parse(menu.items)
        }));
        res.status(200).json(formattedMenus);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTodayMenu = getTodayMenu;
const getUpcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await prisma_1.default.event.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            orderBy: { date: 'asc' },
            take: 5,
        });
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
const getDdayEvent = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const event = await prisma_1.default.event.findFirst({
            where: {
                date: {
                    gte: today,
                },
            },
            orderBy: { date: 'asc' },
        });
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDdayEvent = getDdayEvent;
//# sourceMappingURL=dashboard.controller.js.map