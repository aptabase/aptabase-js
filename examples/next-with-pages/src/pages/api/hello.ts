// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { trackEvent } from '@aptabase/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await trackEvent('hello', { name: 'John Doe' }, req);
  res.status(200).json({ name: 'John Doe' });
}
