import re

# Bloom's Taxonomy Verb Mapping
RBT_VERBS = {
    "L1": ["define", "list", "state", "recall", "name", "label", "what is", "identify"],
    "L2": ["explain", "describe", "summarize", "interpret", "classify", "discuss", "compare"],
    "L3": ["apply", "calculate", "solve", "illustrate", "examine", "show", "compute", "implement"],
    "L4": ["analyze", "contrast", "distinguish", "infer", "differentiate", "categorize"],
    "L5": ["evaluate", "justify", "critique", "appraise", "check", "assess", "recommend"],
    "L6": ["design", "create", "construct", "formulate", "develop", "originate", "propose"]
}

def get_level(text):
    """Detects RBT level based on the first action verb found."""
    text = text.lower()
    for level, verbs in RBT_VERBS.items():
        if any(verb in text for verb in verbs):
            return level
    return "L1" # Default to L1 if no verb is matched

def validate_ia_basic(questions, ia_type):
    """
    Validates IA1/IA2 rules: 
    - Part A: 3 L1s, 2 L2s
    - Overall: L1/L2=40%, L3=40%, L4-L6=20%
    """
    errors = []
    # Reset all fix flags initially
    for q in questions:
        q['needsFix'] = False
        
    part_a = [q for q in questions if q['part'] == 'A']
    l1_qs = [q for q in part_a if q['level'] == 'L1']
    l2_qs = [q for q in part_a if q['level'] == 'L2']

    # 1. Part A Split Validation (3 L1, 2 L2)
    if len(l1_qs) > 3:
        errors.append(f"Part A: Found {len(l1_qs)} L1 questions, need 3.")
        for q in l1_qs[3:]: q['needsFix'] = True
    elif len(l1_qs) < 3:
        errors.append(f"Part A: Found {len(l1_qs)} L1 questions, need 3.")
        # Flag any L2 in Part A to be downgraded if needed
        for q in l2_qs: q['needsFix'] = True

    if len(l2_qs) > 2:
        errors.append(f"Part A: Found {len(l2_qs)} L2 questions, need 2.")
        for q in l2_qs[2:]: q['needsFix'] = True

    # 2. Overall Weightage Calculation (Target: 50 Marks)
    total_marks = 50
    l1_l2_m = sum(q['marks'] for q in questions if q['level'] in ['L1', 'L2'])
    l3_m = sum(q['marks'] for q in questions if q['level'] == 'L3')
    high_m = sum(q['marks'] for q in questions if q['level'] in ['L4', 'L5', 'L6'])

    # Validate 40% L1/L2 (20 marks)
    if l1_l2_m > 20:
        errors.append(f"Overall: L1/L2 marks ({l1_l2_m}) exceed 40% limit.")
        # Flag L1/L2 questions not in Part A to be upgraded to L3
        for q in questions:
            if q['part'] != 'A' and q['level'] in ['L1', 'L2']:
                q['needsFix'] = True

    # Validate 40% L3 (20 marks)
    if l3_m < 20:
        errors.append(f"Overall: L3 weightage is only {l3_m}/20 marks (40% required).")
        # If L3 is low, flag L1/L2s to be moved up
        for q in questions:
            if q['level'] in ['L1', 'L2'] and not q['needsFix']:
                q['needsFix'] = True
                break # Flag one to start rebalancing

    return errors, questions

def validate_model_exam(questions):
    """
    Validates IA3/Model rules:
    - Part A: Unit-wise L1/L2 alternation
    - Overall: 40/40/20 distribution
    """
    errors = []
    for q in questions: q['needsFix'] = False

    # Part A Logic: 10 Qs, Unit-wise L1/L2 check
    for i in range(1, 11, 2):
        q1 = next((q for q in questions if q['id'] == str(i)), None)
        q2 = next((q for q in questions if q['id'] == str(i+1)), None)
        if q1 and q2 and q1['level'] == q2['level']:
            errors.append(f"Unit {(i//2)+1}: Questions {i} and {i+1} must have different RBT levels.")
            q2['needsFix'] = True # Flag the second one for AI change

    return errors, questions