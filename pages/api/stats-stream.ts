// /pages/api/stats-stream.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import statsStore from '../../lib/statsStore';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Устанавливаем заголовки для SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const sendStats = async () => {
    try {
      const count = await statsStore.getCount();
      const data = JSON.stringify({
        requests: count,
        timestamp: Date.now()
      });
      
      res.write(` ${data}\n\n`);
    } catch (error) {
      console.error('Error sending stats:', error);
    }
  };

  // Отправляем начальные данные
  await sendStats();

  // Отправляем обновления каждую секунду
  const interval = setInterval(sendStats, 1000);

  // Очищаем интервал при закрытии соединения
  req.on('close', () => {
    clearInterval(interval);
  });

  // Предотвращаем завершение ответа
  req.on('end', () => {
    clearInterval(interval);
  });
}
