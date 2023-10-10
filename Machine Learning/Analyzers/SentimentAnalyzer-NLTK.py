import numpy as np
import nltk
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.metrics import classification_report

nltk.download('all')

# setup proxy
nltk.set_proxy('http://proxy.wellsfargo.com:8080')

df = pd.read_csv('./Datasets/customerFeedback.csv')

def process_feedback(feedback):
    tokens = word_tokenize(feedback.lower())
    filtered_tokens = [token for token in tokens if token not in stopwords.words('english')]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
    processed_feedback = ' '.join(lemmatized_tokens)
    return processed_feedback

df['reviewText'] = df['reviewText'].apply(process_feedback)

analyzer = SentimentIntensityAnalyzer()

def identify_sentiment(feedback):
    scores = analyzer.polarity_scores(feedback)
    sentiment = 1 if scores['pos'] > 0 else 0
    return sentiment

df['sentiment'] = df['reviewText'].apply(identify_sentiment)
print(classification_report(df['Positive'], df['sentiment']))

    