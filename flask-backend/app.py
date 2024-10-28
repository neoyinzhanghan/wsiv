from flask import Flask, send_file, request, jsonify, make_response
import openslide
import io
import os

app = Flask(__name__)

# Directory for uploaded slides
UPLOAD_FOLDER = "/media/hdd3/neo/uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to get the full path of a slide
def get_slide_path(slide_name):
    return os.path.join(UPLOAD_FOLDER, slide_name)

# Create a placeholder variable for the slide
slide = None

@app.route('/upload', methods=['POST'])
def upload_slide():
    global slide
    if 'file' not in request.files:
        return jsonify(success=False, error="No file part"), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, error="No selected file"), 400

    if file:
        slide_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(slide_path)
        
        try:
            slide = openslide.OpenSlide(slide_path)
            return jsonify(success=True, slide_name=file.filename, width=slide.dimensions[0], height=slide.dimensions[1], max_level=slide.level_count - 1)
        except Exception as e:
            return jsonify(success=False, error=str(e)), 500

@app.route('/tile/<int:level>/<int:x>/<int:y>/', methods=['GET'])
def get_tile(level, x, y):
    global slide
    if not slide:
        return "No slide loaded", 400

    tile_size = 512
    openslide_level = slide.level_count - 1 - level
    tile_x = x * tile_size * (2 ** openslide_level)
    tile_y = y * tile_size * (2 ** openslide_level)

    try:
        region = slide.read_region((tile_x, tile_y), openslide_level, (tile_size, tile_size)).convert("RGB")
        img_io = io.BytesIO()
        region.save(img_io, format='JPEG', quality=90)
        img_io.seek(0)
        response = make_response(send_file(img_io, mimetype='image/jpeg'))
        
        # Disable caching at the HTTP level
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        return "Tile not found", 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
