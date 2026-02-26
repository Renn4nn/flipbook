import type { Prisma } from '../../../generated/prisma/client.js'

export const seedDocuments: Prisma.DocumentCreateInput[] = [
    {
        id: 'a1f3c9e2-7b44-4d8a-9c11-0f2e6b7d1a01',
        filename: 'blame-vol01.pdf', 
        path: '/uploads/a1f3c9e2-7b44-4d8a-9c11-0f2e6b7d1a01.pdf', 
    },
    {
        id: 'b7d2a410-3c5e-4f91-8a22-1e9c4d6f2b02',
        filename: 'one-piece-vol10.pdf',
        path: '/uploads/b7d2a410-3c5e-4f91-8a22-1e9c4d6f2b02.pdf',
    },
    {
        id: 'c4e8f123-9a77-4b2d-bc33-2a7f5d8e3c03',
        filename: 'attack-on-titan-especial.pdf',
        path: '/uploads/c4e8f123-9a77-4b2d-bc33-2a7f5d8e3c03.pdf',
    },
    {
        id: 'd9a1b567-2f88-4c6e-ad44-3b8e6f1a4d04',
        filename: 'jujutsu-kaisen-vol01.pdf',
        path: '/uploads/d9a1b567-2f88-4c6e-ad44-3b8e6f1a4d04.pdf',
    },
]