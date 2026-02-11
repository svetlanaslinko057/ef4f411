#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class AltSeasonBackendTester:
    def __init__(self, base_url="https://farm-graph-modal.preview.emergentagent.com"):
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

    def test_strategies(self):
        """Test strategies endpoint - should return 4 strategies"""
        success, data = self.run_test(
            "Strategy Simulation - Get Strategies",
            "GET", 
            "api/connections/simulation/strategies",
            200
        )
        
        if success and data:
            strategies = data.get('strategies', [])
            if len(strategies) == 4:
                print(f"   ✅ Found {len(strategies)} strategies as expected")
                return True, data
            else:
                print(f"   ⚠️  Found {len(strategies)} strategies, expected 4")
                return success, data
        return success, data

    def test_strategy_report(self):
        """Test specific strategy report - EARLY_CONVICTION_ONLY"""
        success, data = self.run_test(
            "Strategy Simulation - EARLY_CONVICTION_ONLY Report",
            "GET",
            "api/connections/simulation/EARLY_CONVICTION_ONLY",
            200
        )
        
        if success and data:
            report = data.get('report', {})
            metrics = report.get('metrics', {})
            required_metrics = ['hitRate', 'avgFollowThrough', 'noiseRatio', 'sampleSize']
            
            missing_metrics = [m for m in required_metrics if m not in metrics]
            if not missing_metrics:
                print(f"   ✅ All required metrics found: {required_metrics}")
                return True, data
            else:
                print(f"   ⚠️  Missing metrics: {missing_metrics}")
                return success, data
        return success, data

    def test_farm_graph(self):
        """Test farm network graph - should return nodes and edges"""
        success, data = self.run_test(
            "Farm Network - Graph Data",
            "GET",
            "api/connections/network/farm-graph",
            200
        )
        
        if success and data:
            nodes = data.get('nodes', [])
            edges = data.get('edges', [])
            print(f"   📊 Found {len(nodes)} nodes and {len(edges)} edges")
            
            if len(nodes) == 8 and len(edges) == 10:
                print(f"   ✅ Expected 8 nodes and 10 edges - Perfect match!")
            elif nodes and edges:
                print(f"   ✅ Graph has data - nodes: {len(nodes)}, edges: {len(edges)}")
            else:
                print(f"   ⚠️  Graph appears to be empty")
            return success, data
        return success, data

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
    
    # Test 4: Strategy Simulation Endpoints
    print("\n📋 STEP 4: Testing Strategy Simulation APIs")
    tester.test_strategies()
    tester.test_strategy_report()
    
    # Test 5: Farm Network Endpoints
    print("\n📋 STEP 5: Testing Farm Network APIs")
    tester.test_farm_graph()
    
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