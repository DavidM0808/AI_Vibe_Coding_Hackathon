#!/usr/bin/env python3
"""
Example usage script for the Synthetic User Testing MCP Server.

This script demonstrates how to use the MCP server tools to:
1. Visit and analyze web pages
2. Simulate user tasks
3. Collect feedback from different perspectives
4. Compare multiple sites
5. Generate comprehensive reports

Run this script after starting the MCP server to see it in action.
"""

import asyncio
import json
from typing import Dict, Any

# Note: In a real MCP client, you would use the MCP protocol to call these tools
# This is a demonstration of the expected tool calls and responses


class MockMCPClient:
    """Mock MCP client for demonstration purposes"""

    def __init__(self):
        self.session_data = []

    async def call_tool(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        """Simulate calling MCP tools"""
        print(f"\n🔧 Calling tool: {tool_name}")
        print(f"📝 Parameters: {json.dumps(kwargs, indent=2)}")

        # Mock responses based on tool name
        if tool_name == "visit_page":
            return {
                "url": kwargs["url"],
                "title": "Example Website",
                "main_text": "Welcome to our website. We offer great services and products.",
                "navigation_elements": ["Home", "About", "Services", "Contact", "Login"],
                "load_time": 1.45,
                "timestamp": "2024-01-15T10:30:00"
            }

        elif tool_name == "simulate_task":
            # Simulate signup failure
            success = "sign up" not in kwargs["task_description"]
            return {
                "session_id": f"session_{len(self.session_data) + 1}",
                "success": success,
                "steps_taken": 3 if not success else 5,
                "time_taken": 15.67 if not success else 8.23,
                "steps_attempted": [
                    "Looked for signup button",
                    "Clicked on 'Login' link",
                    "Could not find registration option"
                ] if not success else [
                    "Found contact form",
                    "Filled in name field",
                    "Filled in email field",
                    "Clicked submit button",
                    "Form submitted successfully"
                ],
                "error_message": "No clear signup option found" if not success else None
            }

        elif tool_name == "collect_feedback":
            perspective = kwargs.get("perspective", "new_user")
            if perspective == "new_user":
                return {
                    "session_id": f"feedback_{len(self.session_data) + 1}",
                    "positives": [
                        "Page loads quickly",
                        "Clear page title",
                        "Good navigation structure"
                    ],
                    "negatives": [
                        "Lacks clear guidance for new users",
                        "No search functionality found",
                        "Signup button hard to find"
                    ],
                    "overall_score": 6,
                    "perspective": perspective
                }
            else:  # expert_user
                return {
                    "session_id": f"feedback_{len(self.session_data) + 1}",
                    "positives": [
                        "Comprehensive navigation for power users",
                        "Page loads quickly",
                        "Good content structure"
                    ],
                    "negatives": [
                        "No search functionality found",
                        "Limited advanced features"
                    ],
                    "overall_score": 7,
                    "perspective": perspective
                }

        elif tool_name == "analyze_usability":
            return {
                "metrics_analyzed": kwargs["metrics"],
                "total_urls": len(kwargs["urls"]),
                "rankings": {
                    "clarity": [
                        {"rank": 1, "url": kwargs["urls"][0], "score": 8},
                        {"rank": 2, "url": kwargs["urls"][1], "score": 6}
                    ],
                    "speed": [
                        {"rank": 1, "url": kwargs["urls"][1], "score": 9},
                        {"rank": 2, "url": kwargs["urls"][0], "score": 7}
                    ],
                    "overall": [
                        {"rank": 1, "url": kwargs["urls"][0], "score": 7},
                        {"rank": 2, "url": kwargs["urls"][1], "score": 6}
                    ]
                },
                "analysis_summary": f"Best performing site: {kwargs['urls'][0]} (score: 7/10). Fastest loading: {kwargs['urls'][1]} (1.23s)."
            }

        elif tool_name == "generate_report":
            return {
                "report_id": "report_123",
                "format": kwargs.get("format", "markdown"),
                "sessions_included": 5,
                "report_path": "/data/reports/report_123.md",
                "content": "# Synthetic User Testing Report\n\nGenerated: 2024-01-15 10:30:00\n\n## Executive Summary\n- Task Success Rate: 60.0% (3/5)\n- Average User Satisfaction: 6.5/10\n\n## Top Issues:\n- Signup button hard to find (mentioned 3 times)\n- No search functionality found (mentioned 2 times)\n\n## Recommendations\n- **Priority:** Address 'Signup button hard to find' as it was the most frequently reported issue.\n- **General:** Continue regular usability testing to monitor improvements."
            }

        return {"error": f"Unknown tool: {tool_name}"}


async def demonstrate_basic_usage():
    """Demonstrate basic MCP server usage"""
    print("🚀 Synthetic User Testing MCP Server - Example Usage")
    print("=" * 60)

    client = MockMCPClient()

    # 1. Visit a page
    print("\n📄 Step 1: Visit and analyze a webpage")
    page_result = await client.call_tool(
        "visit_page",
        url="https://www.ycombinator.com/"
    )
    print(f"✅ Result: {json.dumps(page_result, indent=2)}")

    # 2. Simulate a task that fails
    print("\n🎭 Step 2: Simulate a user task (signup - will fail)")
    task_result = await client.call_tool(
        "simulate_task",
        url="https://www.ycombinator.com/",
        task_description="sign up for an account",
        perspective="new_user"
    )
    # print(f"✅ Result: {json.dumps(task_result, indent=2)}")

    # 3. Simulate a task that succeeds
    print("\n🎭 Step 3: Simulate a user task (contact - will succeed)")
    contact_result = await client.call_tool(
        "simulate_task",
        url="https://www.ycombinator.com/",
        task_description="find contact information",
        perspective="new_user"
    )
    print(f"✅ Result: {json.dumps(contact_result, indent=2)}")

    # 4. Collect feedback from new user perspective
    print("\n💭 Step 4: Collect feedback from new user perspective")
    new_user_feedback = await client.call_tool(
        "collect_feedback",
        url="https://www.ycombinator.com/",
        perspective="new_user"
    )
    print(f"✅ Result: {json.dumps(new_user_feedback, indent=2)}")

    # 5. Collect feedback from expert user perspective
    print("\n💭 Step 5: Collect feedback from expert user perspective")
    expert_feedback = await client.call_tool(
        "collect_feedback",
        url="https://www.ycombinator.com/",
        perspective="expert_user"
    )
    print(f"✅ Result: {json.dumps(expert_feedback, indent=2)}")


async def demonstrate_comparison():
    """Demonstrate comparing multiple websites"""
    print("\n\n🔍 Comparative Analysis Example")
    print("=" * 40)

    client = MockMCPClient()

    # Compare multiple sites
    print("\n📊 Comparing multiple websites")
    comparison_result = await client.call_tool(
        "analyze_usability",
        urls=["https://www.ycombinator.com/", "https://www.angellist.com/fund-administration?utm_source=google&utm_medium=paid-ads&utm_campaign=FSFM&utm_edition=Feb&utm_term=Funds&gad_source=1&gad_campaignid=21246946045&gbraid=0AAAAACOmokWqSCZrUYZ1OA3iEhVxWEtRn&gclid=EAIaIQobChMIkbT27tPWjwMVDCytBh0i7wH1EAAYASAAEgLGUPD_BwE"],
        metrics=["clarity", "speed", "trust"]
    )
    print(f"✅ Result: {json.dumps(comparison_result, indent=2)}")


async def demonstrate_reporting():
    """Demonstrate report generation"""
    print("\n\n📋 Report Generation Example")
    print("=" * 35)

    client = MockMCPClient()

    # Generate a markdown report
    print("\n📝 Generating comprehensive report")
    report_result = await client.call_tool(
        "generate_report",
        format="markdown"
    )
    print(
        f"✅ Result: {json.dumps({k: v for k, v in report_result.items() if k != 'content'}, indent=2)}")

    # Show report content
    print("\n📄 Report Content Preview:")
    print("-" * 40)
    print(report_result.get("content", "No content")[:500] + "...")
    print("-" * 40)


async def demonstrate_complete_workflow():
    """Demonstrate a complete usability testing workflow"""
    print("\n\n🔄 Complete Workflow Example")
    print("=" * 35)

    client = MockMCPClient()

    print("\n🎯 Testing complete user journey for an e-commerce site")

    # Test different user tasks
    tasks = [
        ("browse products", "new_user"),
        ("sign up for account", "new_user"),
        ("add item to cart", "expert_user"),
        ("checkout process", "expert_user")
    ]

    results = []

    for task_desc, perspective in tasks:
        print(f"\n🎭 Testing: '{task_desc}' as {perspective}")
        result = await client.call_tool(
            "simulate_task",
            url="https://mystore.com",
            task_description=task_desc,
            perspective=perspective
        )
        results.append(result)

        success_emoji = "✅" if result["success"] else "❌"
        print(
            f"{success_emoji} {task_desc}: {'Success' if result['success'] else 'Failed'}")

    # Collect feedback from different perspectives
    print("\n💭 Collecting feedback from different user types")
    perspectives = ["new_user", "expert_user", "elderly_user", "mobile_user"]

    for perspective in perspectives:
        feedback = await client.call_tool(
            "collect_feedback",
            url="https://mystore.com",
            perspective=perspective
        )
        print(f"📊 {perspective}: {feedback['overall_score']}/10")

    # Generate final report
    print("\n📋 Generating final usability report")
    final_report = await client.call_tool(
        "generate_report",
        format="markdown"
    )

    print(f"✅ Report generated: {final_report['report_id']}")
    print(f"📁 Sessions included: {final_report['sessions_included']}")
    print(f"💾 Saved to: {final_report['report_path']}")


def print_integration_guide():
    """Print guide for integrating with real MCP clients"""
    print("\n\n🔌 Integration Guide")
    print("=" * 25)

    print("""
📚 To use this MCP server with real clients:

1. **Claude Desktop Integration:**
   Add to your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "synthetic-testing": {
         "command": "python",
         "args": ["/path/to/server.py"]
       }
     }
   }
   ```

2. **Python MCP Client:**
   ```python
   from mcp import ClientSession
   
   async with ClientSession() as session:
       result = await session.call_tool(
           "visit_page",
           url="https://example.com"
       )
   ```

3. **Available Tools:**
   - visit_page(url)
   - simulate_task(url, task_description, perspective)
   - collect_feedback(url, perspective)
   - analyze_usability(urls, metrics)
   - generate_report(session_id, format)

4. **Available Resources:**
   - /sessions/ - List all test sessions
   - /sessions/{id} - Get specific session
   - /reports/ - List generated reports

5. **Example Prompts for Claude:**
   - "Test the signup flow on example.com as a new user"
   - "Compare the usability of site1.com and site2.com"
   - "Generate a report of all recent testing sessions"
   - "Collect feedback on mysite.com from an elderly user perspective"
""")


async def main():
    """Run all demonstration examples"""
    try:
        await demonstrate_basic_usage()
        await demonstrate_comparison()
        await demonstrate_reporting()
        await demonstrate_complete_workflow()
        print_integration_guide()

        print("\n\n🎉 Example completed successfully!")
        print("\n💡 Next steps:")
        print("   1. Start the MCP server: python server.py")
        print("   2. Integrate with your MCP client")
        print("   3. Begin testing real websites!")

    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
