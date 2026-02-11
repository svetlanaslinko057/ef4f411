#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class AltSeasonBackendTester:
    def __init__(self, base_url="https://twitter-parser-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            # Try to get response as JSON
            try:
                response_data = response.json()
                print(f"   Response JSON: {json.dumps(response_data, indent=2)[:300]}...")
            except:
                print(f"   Response Text: {response.text[:200]}...")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                return True, response_data if 'response_data' in locals() else {}
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_connections_health(self):
        """Test connections module health"""
        return self.run_test(
            "Connections Health",
            "GET",
            "api/connections/health",
            200
        )

    def test_opportunities(self):
        """Test opportunities endpoint"""
        return self.run_test(
            "Top Opportunities",
            "GET",
            "api/connections/opportunities",
            200
        )

    def test_momentum(self):
        """Test momentum endpoint"""
        return self.run_test(
            "Token Momentum",
            "GET",
            "api/connections/momentum",
            200
        )

    def test_opportunities_stats(self):
        """Test opportunities stats endpoint"""
        return self.run_test(
            "Opportunities Stats",
            "GET",
            "api/connections/opportunities/stats",
            200
        )

    def test_alt_season(self):
        """Test alt season endpoint"""
        return self.run_test(
            "Alt Season Probability",
            "GET",
            "api/connections/alt-season",
            200
        )

    def test_market_state(self):
        """Test market state endpoint"""
        return self.run_test(
            "Market State",
            "GET",
            "api/connections/market-state",
            200
        )

def main():
    print("=" * 60)
    print("🧪 ALT SEASON MONITOR BACKEND API TESTS")
    print("=" * 60)
    
    tester = AltSeasonBackendTester()
    
    # Test 1: General Health
    print("\n📋 STEP 1: Testing General Health")
    tester.test_health()
    
    # Test 2: Connections Module Health
    print("\n📋 STEP 2: Testing Connections Module Health")
    tester.test_connections_health()
    
    # Test 3: Alt Season Monitor Specific Endpoints
    print("\n📋 STEP 3: Testing Alt Season Monitor APIs")
    
    # Test the specific endpoints needed by the frontend
    tester.test_opportunities()
    tester.test_momentum()
    tester.test_opportunities_stats()
    tester.test_alt_season()
    tester.test_market_state()
    
    # Print results
    print("\n" + "=" * 60)
    print("📊 FINAL RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("❌ SOME TESTS FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())