from flask import Flask, request, jsonify
from pprint import pprint
import json
from dotenv import load_dotenv
import os
import requests

load_dotenv()

TOKEN = os.getenv("TOKEN")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
app = Flask(__name__)

# fetching nodes and edges from the json file

with open('data.json', 'r') as f:
    G = json.loads(f.read())

nodes = {node["id"]: node["data"] for node in G["nodes"]}
edges = G["edges"]



def get_adj(nodes, edges):
    adj = {}
    for node in nodes:
        adj[node] = []
    for edge in edges:
        adj[edge["source"]].append(edge["target"])
    return adj


def get_thread_nodes(nodes):
    threads = []
    for node in nodes:
        if node["type"] == "flowStartNode":
            threads.append(node["id"])
    return threads


threads = get_thread_nodes(G["nodes"])
adj = get_adj(nodes, edges)
state = {}


def check_threads(message, ph_no, ph_id):
    if ph_no not in state:
        state[ph_no] = [-1] * len(threads)
    for i in range(len(threads)):
        chk_nodes = adj[state[ph_no][i]
                        ] if state[ph_no][i] != -1 else [threads[i]]
        for id in chk_nodes:
            if trigger_check(message, nodes[id]):
                state[ph_no][i] = id
                if nodes[id]["response"]["id"] == "text":
                    send_response(ph_no, nodes[id]["properties"][0]["value"], ph_id)


def check_text_msg_rules(rules, message):
    for rule in rules:
        if rule["operator"] == "is" and rule["value"] != message:
            return False
        elif rule["operator"] == "is-not" and rule["value"] == message:
            return False
        elif rule["operator"] == "contains" and rule["value"] not in message:
            return False
        elif rule["operator"] == "not-contains" and rule["value"] in message:
            return False
    return True


def trigger_check(message, node):
    if node["trigger"]["id"] == "text" and "text" in message \
            and check_text_msg_rules(node["rules"], message["text"]["body"]):
        return True
    elif "interactive" in message and message["interactive"]["type"] == "list_reply":
        return True
    return False


def send_response(to, body, ph_id):
    url = f"https://graph.facebook.com/v21.0/{ph_id}/messages"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {
            "body": body
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    print("Response sent:", response.status_code, response.json())



@app.route("/bot", methods=["GET"])
def verify_webhook():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("WEBHOOK_VERIFIED")
        return challenge, 200
    else:
        return "Verification failed", 403


@app.route("/bot", methods=["POST"])
def webhook():
    data = request.json

    pprint(data)
    # Check if the webhook contains a message
    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                messages = change.get("value", {}).get("messages", [])
                # Check if the webhook contains a message
                if not messages:
                    continue
                for message in messages:
                    ph_id = change.get("value", {}).get(
                        "metadata", {}).get("phone_number_id", 0)
                    # Handle List Message reply
                    check_threads(message, message["from"], ph_id)
                    return jsonify({"status": "success", "message": "Response sent"}), 200

    return "Event received", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
