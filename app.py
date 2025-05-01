import os
import json
from flask import Flask, render_template, request, jsonify
import openai
import dotenv

dotenv.load_dotenv()
app = Flask(__name__, static_folder="static", template_folder="templates")
openai.api_key = os.getenv("OPENAI_API_KEY")

# Quiz data for Lessons
QUIZ_DATA = {
    "part1": {
        "title": "Part 1: General Knowledge on Somalia",
        "cards": [
            {"question": "What is the capital city of Somalia?", "answer": "Mogadishu"},
            {"question": "What is Somalia's official currency?", "answer": "Somali shilling"},
            {"question": "Which body of water borders Somalia to the east?", "answer": "Indian Ocean"}
        ]
    },
    "part2": {
        "title": "Part 2: Somali Language Basics",
        "cards": [
            {"question": "How do you say 'Hello' in Somali?", "answer": "Salaam"},
            {"question": "How do you say 'Thank you' in Somali?", "answer": "Mahadsanid"},
            {"question": "What is the Somali word for 'water'?", "answer": "Biyo"}
        ]
    },
    "part3": {
        "title": "Part 3: Somali History",
        "cards": [
            {"question": "In what year did Somalia gain independence?", "answer": "1960"},
            {"question": "Which ancient trading civilization was centered in present‑day Somalia?", "answer": "Punt"},
            {"question": "What was the name of the Somali republic formed in 1960?", "answer": "Somali Republic"}
        ]
    }
}

# --- Page Routes ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/mohammed')
def mohammed():
    return render_template('mohammed.html')
@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/itinerary')
def itinerary():
    return render_template('itinerary.html')

@app.route('/gallery-carousel')
def gallery_carousel():
    return render_template('gallery_carousel.html')

@app.route('/lessons')
def lessons():
    parts = [
        {"id": "part1", "title": QUIZ_DATA["part1"]["title"]},
        {"id": "part2", "title": QUIZ_DATA["part2"]["title"]},
        {"id": "part3", "title": QUIZ_DATA["part3"]["title"]},
    ]
    return render_template('lessons.html', parts=parts)

@app.route('/lessons/<part_id>')
def quiz(part_id):
    part = QUIZ_DATA.get(part_id)
    if not part:
        return "Quiz part not found", 404
    return render_template(
        'quiz.html',
        title=part["title"],
        cards_json=json.dumps(part["cards"])
    )

# --- API Endpoints ---

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    base_prompt = (
        "You are the best Somali travel guide in the world. You also speak Somali and English. "
        "Make sure to remind users you can speak both. You can utilize the web to answer queries."
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": base_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200
        )
        reply = response.choices[0].message.content.strip()
    except Exception as e:
        reply = f"Error: {e}"
    return jsonify({'reply': reply})

@app.route('/generate_itinerary', methods=['POST'])
def generate_itinerary():
    data = request.get_json() or {}
    print("Received data:", data)

    personality = data.get('personality', '')
    days = data.get('days', '')
    habits = data.get('habits', '')
    pace = data.get('pace', 'moderate')

    prompt = (
        f"Create a personalized, highly detailed itinerary for a traveler visiting Mogadishu exclusively.\n"
        f"Length of stay: {days} days\n"
        f"Personality: {personality}\n"
        f"Holiday habits: {habits}\n"
        f"Preferred pace: {pace}\n\n"
        "Provide a day-by-day plan labeled Day 1, Day 2, etc. Under each day, list bullet points in the format:\n"
        "- HH:MM AM/PM - Activity description\n"
        "Use specific local landmarks and cultural experiences in Mogadishu."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a travel planning assistant for Mogadishu."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=700,
        )
        itinerary = response.choices[0].message.content.strip()
    except Exception as e:
        itinerary = f"Error: {str(e)}\n{traceback.format_exc()}"

    return jsonify({'itinerary': itinerary})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
