import json
import urllib.request
import urllib.error

API_BASE_URL = "http://localhost:8000/api/v1"

PROFILES = [
    {
        "phone": "+918888888881",
        "name": "Arjun Farmer",
        "role": "farmer",
        "village": "Greenville",
        "district": "Agriward",
        "state": "Punjab"
    },
    {
        "phone": "+918888888882",
        "name": "Punjab Soil Labs",
        "role": "lab",
        "address": "123 Science Park, Tech City",
        "state": "Punjab"
    },
    {
        "phone": "+918888888883",
        "name": "Indo Bio-Pellet Plant",
        "role": "buyer",
        "address": "Industrial Area, Phase 1",
        "state": "Haryana"
    }
]

def make_request(url, method="POST", data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        raise
    except urllib.error.URLError as e:
        print(f"URL Error: {e.reason}")
        raise

def seed_via_api():
    for profile in PROFILES:
        phone = profile["phone"]
        print(f"Creating/Logging in {profile['role']} account ({phone})...")
        
        # Step 1: Request OTP
        try:
            data1 = make_request(f"{API_BASE_URL}/auth/otp/request", data={"phone": phone})
            otp = data1.get("dev_otp")
            if not otp:
                print(f"Failed to get dev_otp for {phone}. Dev mode might be off.")
                continue
        except Exception:
            continue

        # Step 2: Verify OTP
        try:
            data2 = make_request(f"{API_BASE_URL}/auth/otp/verify", data={"phone": phone, "otp": otp})
            access_token = data2.get("access_token")
        except Exception:
            continue

        # Step 3: Complete Profile
        try:
            profile_payload = {k: v for k, v in profile.items() if k != "phone"}
            headers = {"Authorization": f"Bearer {access_token}"}
            make_request(f"{API_BASE_URL}/auth/profile", method="PATCH", data=profile_payload, headers=headers)
            print(f"-> Set up {profile['role']} successfully: {profile['name']}\n")
        except Exception:
            pass

    print("Done setting up test users.")

if __name__ == "__main__":
    seed_via_api()
