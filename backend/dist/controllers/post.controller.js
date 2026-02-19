"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
const postSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    category: zod_1.z.string().optional(),
    type: zod_1.z.enum(['NOTICE', 'COMMUNITY']),
});
const getPosts = async (req, res) => {
    try {
        const { type, page = '1', limit = '10' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (type) {
            where.type = type;
        }
        const [posts, total] = await Promise.all([
            prisma_1.default.post.findMany({
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
            prisma_1.default.post.count({ where }),
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPosts = getPosts;
const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma_1.default.post.findUnique({
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
        await prisma_1.default.post.update({
            where: { id: Number(id) },
            data: { viewCount: { increment: 1 } },
        });
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPost = getPost;
const createPost = async (req, res) => {
    try {
        const validatedData = postSchema.parse(req.body);
        const { title, content, category, type } = validatedData;
        const post = await prisma_1.default.post.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = postSchema.partial().parse(req.body);
        const existingPost = await prisma_1.default.post.findUnique({ where: { id: Number(id) } });
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const post = await prisma_1.default.post.update({
            where: { id: Number(id) },
            data: validatedData,
        });
        res.status(200).json(post);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPost = await prisma_1.default.post.findUnique({ where: { id: Number(id) } });
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await prisma_1.default.post.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=post.controller.js.map