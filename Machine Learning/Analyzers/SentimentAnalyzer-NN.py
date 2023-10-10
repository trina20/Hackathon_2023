import numpy as np
import pandas as pd
import tensorflow as tf
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout

df = pd.read_csv('./Datasets/customerReviews.csv', encoding='latin-1')

#process the dataset
df = df[['Review', 'Rating']]
df['Sentiment'] = df['Rating'].apply(lambda x: 'positive' if x > 3 else 'negative' if x < 3 else 'neutral')
df = df[['Review', 'Sentiment']]
df = df.sample(frac=1).reset_index(drop=True)

#tokenize
tokenizer = Tokenizer(num_words=5000, oov_token='')
tokenizer.fit_on_texts(df['Review'])
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(df['Review'])
padded_sequences = pad_sequences(sequences, maxlen=100, truncating='post')

#convert sentiment labels to one hot encoding
sentiment_labels = pd.get_dummies(df['Sentiment']).values

#train and test dataset
x_train, x_test, y_train, y_test = train_test_split(padded_sequences, sentiment_labels, test_size=0.2)

#model
model = Sequential()
model.add(Embedding(5000,100, input_length=100))
model.add(Conv1D(64, 5, activation='relu'))
model.add(GlobalMaxPooling1D())
model.add(Dense(32, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(3, activation='softmax'))
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

#train the model
model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_test, y_test))

#evaluate the model
y_pred = np.argmax(model.predict(x_test), axis=-1)
print("Accuracy: ", accuracy_score(np.argmax(y_test, axis=-1), y_pred))

#save the model
model.save('./Models/sentiment_analysis_model.h5')
with open('./Models/tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
    
print("Model generated and saved.")



