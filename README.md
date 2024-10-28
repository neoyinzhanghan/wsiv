# wsiv -- WSI Viewer

This repository hosts a web-based Whole Slide Image (WSI) Viewer using Next.js and Flask. The viewer allows users to upload a slide image (e.g., `.svs`, `.ndpi`) and visualize it with a zoomable viewer using OpenSeadragon.

## How to Run

### 1. Start the Flask Backend

Navigate to the `flask-backend` directory and run:

```bash
pip install flask openslide-python
python app.py
