from flask import Flask, request, jsonify
import numpy as np
import pickle
import os

app = Flask(__name__)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "Flask ML API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(features)[0]
    return jsonify({"prediction": int(prediction)})

# ✅ ADD THIS
@app.route("/test", methods=["GET"])
def test():
    return jsonify({
        "all_yes": int(model.predict([[1,1,1,1,1,1,1,1,1,1]])[0]),
        "all_no": int(model.predict([[0,0,0,0,0,0,0,0,0,0]])[0])
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
