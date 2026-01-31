from bs4 import BeautifulSoup
import re

def parse_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    questions = []
    
    # Logic to find the table and rows in your CIT template
    rows = soup.find_all('tr')
    
    current_part = "A"
    for row in rows:
        cols = row.find_all('td')
        if not cols: continue
        
        text_content = row.get_text().strip().lower()
        
        # Identify Part Switches
        if "part - b" in text_content: current_part = "B"
        if "part - c" in text_content: current_part = "C"
        
        # Extract columns (Assuming CIT Template: Q.No | Question | CO | Marks)
        if len(cols) >= 4:
            q_no = cols[0].get_text().strip()
            q_text = cols[1].get_text().strip()
            co = cols[2].get_text().strip()
            marks_raw = cols[3].get_text().strip()
            
            # Clean marks to be an integer
            marks = int(re.search(r'\d+', marks_raw).group()) if re.search(r'\d+', marks_raw) else 2
            
            if q_no.isdigit():
                questions.append({
                    "id": q_no,
                    "text": q_text,
                    "co": co,
                    "marks": marks,
                    "part": current_part
                })
                
    return questions