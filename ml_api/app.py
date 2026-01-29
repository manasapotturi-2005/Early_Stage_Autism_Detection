from flask import Flask, request, jsonify
import numpy as np
import pickle
import os

app = Flask(__name__)

# Load trained model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "Flask ML API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array(data["features"]).reshape(1, -1)

        prediction = model.predict(features)[0]

        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
