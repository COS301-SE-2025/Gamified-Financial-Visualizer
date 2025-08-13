def generate_summary_text(features, sentiment):
    statements = [
        f"You're currently feeling {sentiment.lower()} based on your spending and savings behavior.\n",
        f"You saved {int(features['savings_rate'] * 100)}% of your income this month.\n",
        f"Your daily spending averaged R{int(features['burn_rate'])}.\n",
        f"Goal completion rate: {int(features['goal_completion_ratio'] * 100)}%.\n"
    ]
    if features["top_category"]:
        statements.append(f"Most spent category this month: {features['top_category']['name']}.")
    return " ".join(statements)
