import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
  type: z.enum(['NOTICE', 'COMMUNITY']),
});

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (type) {
      where.type = type as string;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { nickname: true, avatarColor: true },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.status(200).json({
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: {
          select: { nickname: true, avatarColor: true },
        },
        comments: {
          include: {
            author: {
              select: { nickname: true, avatarColor: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    await prisma.post.update({
      where: { id: Number(id) },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPost = async (req: any, res: Response) => {
  try {
    const validatedData = postSchema.parse(req.body);
    const { title, content, category, type } = validatedData;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        type,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: { nickname: true, avatarColor: true },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePost = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = postSchema.partial().parse(req.body);

    const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePost = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });

    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.post.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};