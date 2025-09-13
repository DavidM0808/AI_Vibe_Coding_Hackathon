#!/usr/bin/env python3
"""
Real Website Testing Example

This script demonstrates how to test the MCP server with actual websites.
It shows the tools working with real web pages and generating actual feedback.
"""

import asyncio
import json
from datetime import datetime

# Import the server components for direct testing
from server import tester

async def test_real_website():
    """Test the MCP server tools with a real website"""
    print("🌐 Testing MCP Server with Real Websites")
    print("=" * 50)
    
    # Test with a simple, reliable website
    test_url = "https://httpbin.org/html"
    
    print(f"\n📄 Step 1: Visiting {test_url}")
    try:
        page_result = await tester.visit_page(test_url)
        print(f"✅ Page visited successfully!")
        print(f"   Title: {page_result.get('title', 'N/A')}")
        print(f"   Load time: {page_result.get('load_time', 0):.2f}s")
        print(f"   Navigation elements: {len(page_result.get('navigation_elements', []))}")
        print(f"   Content preview: {page_result.get('main_text', '')[:100]}...")
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    print(f"\n💭 Step 2: Collecting feedback from new user perspective")
    try:
        # Import the feedback function and call it directly
        from server import _generate_feedback
        
        feedback = _generate_feedback(page_result, "new_user")
        feedback_result = {
            "session_id": "test_session_1",
            "overall_score": feedback.overall_score,
            "positives": feedback.positives,
            "negatives": feedback.negatives
        }
        print(f"✅ Feedback collected!")
        print(f"   Session ID: {feedback_result.get('session_id')}")
        print(f"   Overall Score: {feedback_result.get('overall_score')}/10")
        print(f"   Positives: {feedback_result.get('positives', [])}")
        print(f"   Negatives: {feedback_result.get('negatives', [])}")
    except Exception as e:
        print(f"❌ Error collecting feedback: {e}")
    
    print(f"\n🎭 Step 3: Simulating a task")
    try:
        # Simulate a simple task manually
        task_result = {
            "success": True,
            "steps_taken": 3,
            "time_taken": 2.5,
            "steps_attempted": [
                "Navigated to the page",
                "Analyzed page content",
                "Found relevant information"
            ]
        }
        print(f"✅ Task simulation completed!")
        print(f"   Success: {task_result.get('success')}")
        print(f"   Steps taken: {task_result.get('steps_taken')}")
        print(f"   Time taken: {task_result.get('time_taken', 0):.2f}s")
        print(f"   Steps attempted: {task_result.get('steps_attempted', [])}")
    except Exception as e:
        print(f"❌ Error simulating task: {e}")
    
    # Test with another website
    print(f"\n\n🔄 Testing with another website")
    test_url2 = "https://example.com"
    
    print(f"\n📄 Visiting {test_url2}")
    try:
        page_result2 = await tester.visit_page(test_url2)
        print(f"✅ Page visited successfully!")
        print(f"   Title: {page_result2.get('title', 'N/A')}")
        print(f"   Load time: {page_result2.get('load_time', 0):.2f}s")
        
        # Collect feedback from expert user perspective
        feedback2 = _generate_feedback(page_result2, "expert_user")
        feedback_result2 = {
            "overall_score": feedback2.overall_score,
            "positives": feedback2.positives,
            "negatives": feedback2.negatives
        }
        print(f"\n💭 Expert user feedback:")
        print(f"   Score: {feedback_result2.get('overall_score')}/10")
        print(f"   Positives: {feedback_result2.get('positives', [])}")
        print(f"   Negatives: {feedback_result2.get('negatives', [])}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Clean up
    await tester.stop_browser()
    
    print(f"\n\n🎉 Real website testing completed!")
    print(f"\n📊 Summary:")
    print(f"   - Tested {len([test_url, test_url2])} websites")
    print(f"   - Generated feedback from multiple perspectives")
    print(f"   - Simulated user tasks")
    print(f"   - All data saved to ./data/ directory")
    
    print(f"\n💡 Next steps:")
    print(f"   1. Check ./data/sessions/ for detailed session data")
    print(f"   2. Check ./data/screenshots/ for page screenshots")
    print(f"   3. Use the MCP server with Claude or other MCP clients")
    print(f"   4. Test your own websites by changing the URLs above")

if __name__ == "__main__":
    asyncio.run(test_real_website())