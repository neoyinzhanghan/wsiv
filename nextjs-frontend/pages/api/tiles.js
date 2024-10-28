// pages/api/tiles.js
export default async function handler(req, res) {
    const { level, x, y } = req.query;
  
    // Construct the tile path based on your file storage logic.
    // Ensure you are serving tiles from the correct path.
  
    // Example (replace this with actual logic):
    const tilePath = path.join(process.cwd(), 'public', 'tiles', `level_${level}`, `${x}_${y}.jpg`);
  
    if (fs.existsSync(tilePath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      return fs.createReadStream(tilePath).pipe(res);
    } else {
      return res.status(404).json({ error: 'Tile not found' });
    }
  }
  