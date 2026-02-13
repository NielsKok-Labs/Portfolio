import json

with open("data/certs-labs.json") as f:
    data = json.load(f)

# Certs
with open("certs.md", "w") as f:
    f.write("# Certificaten\n\n")
    for cert in data["certs"]:
        status = "x" if cert["status"]=="done" else " "
        f.write(f"- [{status}] {cert['name']}\n")

# Labs
with open("labs.md", "w") as f:
    f.write("# Labs\n\n")
    for lab in data["labs"]:
        status = "x" if lab["status"]=="done" else " "
        f.write(f"- [{status}] {lab['name']}\n")