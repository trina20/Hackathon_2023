from flask import Flask, request, json
import tensorflow as tf
import numpy as np
import keras
import pickle
from tensorflow.keras import backend
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

model = "test"
tokenizer = "test"

def loadModelAndTokenizer():
    global model
    model = keras.models.load_model('./Models/sentiment_analysis_model.h5')
    with open('./Models/tokenizer.pickle', 'rb') as handle:
        global tokenizer
        tokenizer = pickle.load(handle)
        
def predict_sentiment(text):
    text_sequence = tokenizer.texts_to_sequences([text])
    text_sequence = pad_sequences(text_sequence, maxlen=100)
    
    predicted_rating = model.predict(text_sequence)[0]
    if np.argmax(predicted_rating) == 0:
        return 'Negative'
    elif np.argmax(predicted_rating) == 1:
        return 'Neutral'
    else:
        return 'Positive'
    
def loadModel():
    app.predictor = load_model('./Models/sentiment_analysis_model.h5')
    
with app.app_context():
    loadModelAndTokenizer()
    
@app.route("/predict", methods=['POST'])
def predict():
    data = request.get_json()
    sentiment = predict_sentiment(data['data'])
    print(sentiment)
    return sentiment

if __name__ == '__main__':
    app.run(debug=True)