import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTodayKnowledge = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const knowledge = await prisma.dailyKnowledge.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!knowledge) {
      // Return a default or a random one if today's is not set
      const randomKnowledge = await prisma.dailyKnowledge.findFirst();
      return res.status(200).json(randomKnowledge);
    }

    res.status(200).json(knowledge);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTodayMenu = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const menus = await prisma.menu.findMany({
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
      items: JSON.parse(menu.items as string)
    }));

    res.status(200).json(formattedMenus);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDdayEvent = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const event = await prisma.event.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: { date: 'asc' },
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};