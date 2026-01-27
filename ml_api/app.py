from flask import Flask, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load trained model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# Home route (fixes Cannot GET /)
@app.route("/")
def home():
    return "Flask ML API is running!"

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array(data["features"]).reshape(1, -1)

        prediction = model.predict(features)[0]  # 0 or 1

        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
