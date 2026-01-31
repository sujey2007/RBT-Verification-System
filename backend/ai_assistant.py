import google.generativeai as genai

# Replace with your actual Gemini API Key
genai.configure(api_key="")
model = genai.GenerativeModel('gemini-2.5-flash')

def rephrase_question(original_text, current_level, target_level):
    prompt = f"""
    Rephrase this academic question to match RBT Level: {target_level}.
    Original Question: {original_text}
    
    Rules:
    1. Use appropriate action verbs for {target_level}.
    2. Maintain the technical subject matter exactly.
    3. Return ONLY the new question text.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"