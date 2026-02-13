import json
import os

# pad naar JSON
json_path = os.path.join("data", "certs-labs.json")

with open(json_path, "r") as f:
    data = json.load(f)

# certs.md
with open("certs.md", "w") as f:
    f.write("# Certificaten\n\n")
    for cert in data.get("certs", []):
        f.write(f"- {cert['name']} ({cert['status']})\n")

# labs.md
with open("labs.md", "w") as f:
    f.write("# Labs\n\n")
    for lab in data.get("labs", []):
        f.write(f"- {lab['name']} ({lab['status']})\n")
