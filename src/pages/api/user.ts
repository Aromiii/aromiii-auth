import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { z } from "zod";
import {prisma} from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: "You must be logged in" });
    }

    if (req.method == "PUT") {
        const schema = z.object({
            firstName: z.string().max(50),
            lastName: z.string().max(50),
            displayName: z.string().min(3).max(30),
            username: z.string().min(3).max(30)
                .transform((value) => {
                    // Remove whitespace
                    value = value.trim().replace(/\s+/g, '');

                    // Remove special characters
                    value = value.replace(/[^a-zA-Z0-9-._~]/g, '');

                    // Percent-encode the string
                    value = encodeURIComponent(value);

                    return value;
                })
                .refine((value) => {
                    // Check if the resulting string is a valid URL path segment
                    const url = new URL(`https://example.com/${value}`);
                    return url.pathname.slice(1) === value;
                }, {
                    message: 'Value is not a valid URL path segment'
                }),
        });

        const body = schema.safeParse(req.body);

        if (!body.success) {
            res.status(400).json({ message: "Data you provided is not in correct format" });
            return;
        }

        try {
            await prisma.user.update({
                where: {
                    id: session?.user.id
                },
                data: {
                    displayName: body.data.displayName,
                    username: body.data.username,
                    firstName: body.data.firstName,
                    lastName: body.data.lastName
                }
            })
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: "Error occurred" });
            return;
        }

        res.status(200).json({ message: "Profile updated" });
        return;
    }
};

export default handler;