// pages/api/tiles.js

import path from 'path';
import { promises as fs } from 'fs';
import { createReadStream } from 'fs';
import OpenSeadragon from 'openseadragon';

export default async function handler(req, res) {
  const { level, x, y } = req.query;
  const tilePath = path.join(process.cwd(), `/public/tiles/level${level}_x${x}_y${y}.jpeg`);

  try {
    // Check if the tile file exists
    await fs.access(tilePath);
    // Pipe the tile file as a response
    const stream = createReadStream(tilePath);
    res.setHeader('Content-Type', 'image/jpeg');
    stream.pipe(res);
  } catch (error) {
    res.status(404).json({ success: false, error: 'Tile not found' });
  }
}
