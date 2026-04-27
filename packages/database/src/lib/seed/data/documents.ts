import type { Prisma } from '../../../generated/prisma/client.js'

export const seedDocuments: Prisma.DocumentCreateInput[] = [
    {
        id: "d2cccaf2-32d8-4707-a76d-a7e90f111ea1",
        filename: "Death Note - 2004 (Shueisha) - 001.pdf",
        path: "/uploads/d2cccaf2-32d8-4707-a76d-a7e90f111ea1.pdf",
        pages: 217,
        size: "15728640",
        isPublic: true
    },
    {
        id: "3e4198c3-8955-4e2f-8998-e14decaf0421",
        filename: "Naruto - 002.pdf",
        path: "/uploads/3e4198c3-8955-4e2f-8998-e14decaf0421.pdf",
        title: "Naruto",
        pages: 180,
        size: "28968841",
        isPublic: true
    },
    {
        id: "4ad55d44-5793-40fc-87d3-606844d03522",
        filename: "Amazing Spider-Man - 1963 (Marvel) - 001.pdf",
        path: "/uploads/4ad55d44-5793-40fc-87d3-606844d03522.pdf",
        pages: 100,
        size: "14680064",
        isPublic: false
    }
]