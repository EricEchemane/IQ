// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from 'lib/connectToDatabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectToDatabase();
  if (!db) {
    res.status(500).json({
      message: 'Could not connect to database',
      success: false
    });
  }
  try {
    const users = await db?.user.find();
    res.json({
      data: users,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
}
