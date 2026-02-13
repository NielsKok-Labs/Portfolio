import json

# Lees JSON
with open("data/certs-labs.json") as f:
    data = json.load(f)

# Schrijf certs.md
with open("certs.md", "w") as f:
    f.write("# Certificaten\n\n")
    for cert in data.get("certs", []):
        f.write(f"- {cert['name']} ({cert['status']})\n")

# Schrijf labs.md
with open("labs.md", "w") as f:
    f.write("# Labs\n\n")
    for lab in data.get("labs", []):
        f.write(f"- {lab['name']} ({lab['status']})\n")
