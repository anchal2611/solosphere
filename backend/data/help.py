import pandas as pd

df = pd.read_parquet("recipes_final.parquet")

print(df.columns.tolist())