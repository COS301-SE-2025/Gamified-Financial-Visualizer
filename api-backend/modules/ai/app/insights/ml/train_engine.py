import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Load behavior data
df = pd.read_csv("sample_user_data.csv")

# Normalize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# Train KMeans
kmeans = KMeans(n_clusters=4, random_state=42)
kmeans.fit(X_scaled)

# Optionally label each user for exploration
df['cluster'] = kmeans.predict(X_scaled)
df.to_csv("labeled_clusters.csv", index=False)

# Save model and scaler
with open("cluster_model.pkl", "wb") as f:
    pickle.dump((kmeans, scaler), f)

print("✅ KMeans clustering model trained and saved as 'cluster_model.pkl'")
