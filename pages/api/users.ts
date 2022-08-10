// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from 'lib/connectToDatabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'entities/user.entity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connection = await connectToDatabase();
  if (!connection) {
    res.status(500).json({
      message: 'Could not connect to database',
      success: false
    });
  }
  try {
    const users = await User.find();
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
