# 🧪 MCP Server Testing Guide

## ✅ Your MCP Server is Ready!

The Synthetic User Testing MCP Server is now fully operational and ready to test any website. Here's how to use it:

## 🚀 Quick Start

### 1. Server Status
- ✅ MCP Server is running on terminal 9
- ✅ All dependencies installed
- ✅ Playwright browsers ready
- ✅ Test scripts working

### 2. Available Tools

| Tool | Purpose | Example Usage |
|------|---------|---------------|
| `visit_page` | Visit and analyze any website | Test page load, navigation, content |
| `simulate_task` | Simulate user interactions | "Sign up", "Find contact info", "Make purchase" |
| `collect_feedback` | Get realistic user feedback | New user, expert user, mobile user perspectives |
| `analyze_usability` | Analyze usability metrics | Performance, accessibility, UX scores |
| `generate_report` | Create detailed reports | Markdown reports with recommendations |

## 🌐 Testing Your Websites

### Method 1: Using the Test Script

1. **Edit the test script:**
   ```bash
   # Edit test_real_website.py
   nano test_real_website.py
   ```

2. **Change the URLs to your websites:**
   ```python
   test_url = "https://your-website.com"
   test_url2 = "https://your-other-site.com"
   ```

3. **Run the test:**
   ```bash
   source venv/bin/activate
   python test_real_website.py
   ```

### Method 2: Using MCP Clients

#### With Claude Desktop:
1. Add this to your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "synthetic-user-testing": {
         "command": "python",
         "args": ["/path/to/synthetic-user-testing-mcp/server.py"],
         "env": {
           "PYTHONPATH": "/path/to/synthetic-user-testing-mcp"
         }
       }
     }
   }
   ```

2. Ask Claude to test your website:
   ```
   Please visit https://my-website.com and collect feedback from a new user perspective
   ```

#### With Python MCP Client:
```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_website():
    server_params = StdioServerParameters(
        command="python",
        args=["server.py"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the session
            await session.initialize()
            
            # Visit a page
            result = await session.call_tool(
                "visit_page",
                arguments={"url": "https://your-website.com"}
            )
            print(result)

asyncio.run(test_website())
```

## 📊 Understanding Results

### Test Output Includes:
- **Page Analysis**: Load time, title, navigation elements
- **User Feedback**: Scores (1-10), positives, negatives
- **Task Simulation**: Success rate, steps taken, time
- **Screenshots**: Saved in `./data/screenshots/`
- **Session Data**: Detailed logs in `./data/sessions/`

### Sample Feedback:
```
✅ Feedback collected!
   Session ID: test_session_1
   Overall Score: 7/10
   Positives: ['Page loads quickly', 'Clear navigation']
   Negatives: ['Missing contact info', 'No search function']
```

## 🎯 Testing Scenarios

### E-commerce Sites:
```python
# Test product search
await simulate_task(url, "search for a product", "new_user")

# Test checkout process
await simulate_task(url, "add item to cart and checkout", "returning_user")
```

### Business Websites:
```python
# Test contact form
await simulate_task(url, "find contact information", "potential_customer")

# Test service discovery
await simulate_task(url, "learn about services offered", "new_user")
```

### SaaS Applications:
```python
# Test signup flow
await simulate_task(url, "create a new account", "new_user")

# Test feature discovery
await simulate_task(url, "explore main features", "trial_user")
```

## 🔧 Customization

### User Personas
The server includes these built-in personas:
- `new_user`: First-time visitor, needs guidance
- `returning_user`: Familiar with site, wants efficiency
- `expert_user`: Power user, wants advanced features
- `mobile_user`: Using mobile device, touch interactions
- `accessibility_user`: Needs accessible design

### Adding Custom Personas
Edit `server.py` and add to the `_generate_feedback` function:
```python
elif perspective == "your_custom_persona":
    # Custom feedback logic
    perspective_factors = {
        "specific_needs": "Custom requirements",
        "expectations": "Custom expectations"
    }
```

## 📈 Advanced Usage

### Batch Testing Multiple URLs:
```python
urls = [
    "https://site1.com",
    "https://site2.com", 
    "https://site3.com"
]

for url in urls:
    result = await visit_page(url)
    feedback = await collect_feedback(url, "new_user")
    # Process results
```

### Comparative Analysis:
```python
# Test competitor sites
competitor_results = []
for competitor_url in competitor_urls:
    result = await analyze_usability(competitor_url)
    competitor_results.append(result)

# Generate comparison report
report = await generate_report(competitor_results, "competitive_analysis")
```

## 🐛 Troubleshooting

### Common Issues:

1. **Browser fails to start:**
   ```bash
   # Reinstall Playwright browsers
   playwright install
   ```

2. **Permission errors:**
   ```bash
   # Check file permissions
   chmod +x server.py
   ```

3. **Module not found:**
   ```bash
   # Activate virtual environment
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Getting Help:
- Check server logs in terminal 9
- Review session data in `./data/sessions/`
- Examine screenshots in `./data/screenshots/`

## 🎉 You're Ready to Test!

Your MCP server is now ready to perform comprehensive synthetic user testing on any website. Start by testing a simple site, then move on to more complex applications as you get familiar with the tools.

**Happy Testing! 🚀**