import requests
from flask import Flask, request, jsonify
from transformers import pipeline

# Initialize the Flask app
app = Flask(__name__)

# Set the model to the one you provided from Hugging Face
MODEL_NAME = "openai-community/gpt2"  # Your selected model

# Load the GPT-2 model using the Hugging Face pipeline
generator = pipeline('text-generation', model=MODEL_NAME)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get the user's question from the request
        user_input = request.json.get('question')

        if not user_input or len(user_input) < 1:
            return jsonify({'error': 'Please provide a valid question'}), 400

        # Generate a response using the selected GPT-2 model with fine-tuned parameters
        response = generator(user_input, max_length=100, num_return_sequences=1, temperature=0.6, top_p=0.9)

        # Extract the generated text from the response
        bot_response = response[0]['generated_text'].strip()

        # Return the bot's response
        return jsonify({'response': bot_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
