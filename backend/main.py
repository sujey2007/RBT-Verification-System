from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import parser_engine
import rbt_validator
# FIX: Removed 'backend.' prefix because Render runs from inside the backend folder
import ai_assistant 

app = FastAPI(title="CIT RBT Verification API")

# Enable CORS so your Expo frontend can communicate with this server
app.add_middleware(
    CORSMiddleware,
    # In production, replace "*" with your actual Vercel URL for better security
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    """Health check route to verify the API is online."""
    return {"status": "Online", "institution": "Chennai Institute of Technology"}

@app.post("/verify")
async def verify_paper(
    file: UploadFile = File(...), 
    ia_type: str = Form(...)
):
    """
    Receives the uploaded question paper and validates it against 
    Bloom's Taxonomy rules.
    """
    try:
        # 1. Read the uploaded file content
        content = await file.read()
        
        # Determine file type and decode
        try:
            html_data = content.decode("utf-8")
        except UnicodeDecodeError:
            html_data = content.decode("latin-1")

        # 2. Extract question data using the parser engine
        questions = parser_engine.parse_html(html_data)
        
        if not questions:
            return {
                "status": "Rejected", 
                "errors": ["Could not extract questions. Please check the document format."],
                "data": []
            }

        # 3. Assign RBT Levels based on keyword analysis
        for q in questions:
            q['level'] = rbt_validator.get_level(q['text'])
            
        # 4. Validate Academic Rules (40/40/20 and Part A splits)
        errors = []
        type_upper = ia_type.upper()
        
        if "IA" in type_upper:
            errors = rbt_validator.validate_ia_basic(questions, ia_type)
        elif "MODEL" in type_upper or "IA 3" in type_upper:
            errors = rbt_validator.validate_model_exam(questions)

        # 5. Return the final result to the dashboard
        return {
            "status": "Accepted" if not errors else "Rejected",
            "errors": errors,
            "data": questions,
            "ia_type": ia_type
        }

    except Exception as e:
        print(f"Error during verification: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error during file processing.")

@app.post("/fix-questions")
async def fix_questions(data: dict):
    """
    Uses Gemini AI to rephrase a specific question to a target RBT level.
    """
    try:
        original_text = data.get('text')
        target_level = data.get('target_level', 'L2')
        current_level = data.get('current_level', 'L1')

        if not original_text:
            raise HTTPException(status_code=400, detail="Question text is required.")

        # Fixed reference to the rephrase function
        new_text = ai_assistant.rephrase_question(original_text, current_level, target_level)
        return {"corrected_text": new_text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Fix Error: {str(e)}")

# This block is for local development only
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)