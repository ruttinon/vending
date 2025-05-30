from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)  # เปิด CORS ให้เรียกจากพอร์ตอื่นได้

# โหลดโมเดล
interpreter = tf.lite.Interpreter(model_path="model_unquant.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# โหลด Labels
with open("labels.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

@app.route('/scan', methods=['POST'])
def scan():
    try:
        print("📥 ได้รับคำขอสแกนภาพ")

        if not request.is_json:
            return jsonify({'error': 'คำขอไม่ใช่ JSON'}), 400

        data = request.get_json()
        image_data = data.get('image')

        if not image_data or ',' not in image_data:
            return jsonify({'error': 'ไม่มีข้อมูลภาพหรือข้อมูลผิดรูปแบบ'}), 400

        print("✅ ได้รับภาพ base64 ยาวประมาณ:", len(image_data))

        # ถอดรหัส base64
        image_data = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_data)).convert("RGB")  # 👈 แปลง RGBA เป็น RGB

        # Resize และ Normalize
        img = np.array(image.resize((224, 224)), dtype=np.float32) / 255.0
        input_data = np.expand_dims(img, axis=0)

        # พยากรณ์
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output = interpreter.get_tensor(output_details[0]['index'])[0]

        predicted_index = int(np.argmax(output))
        predicted_label = labels[predicted_index]
        confidence = float(np.max(output)) * 100

        print(f"✅ ผลลัพธ์: {predicted_label} ({confidence:.2f}%)")

        return jsonify({
            'label': predicted_label,
            'confidence': confidence
        })

    except Exception as e:
        print("❌ เกิดข้อผิดพลาด:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
