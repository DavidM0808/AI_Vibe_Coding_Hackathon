# Synthetic User Testing MCP Server

A Model Context Protocol (MCP) server that simulates real users interacting with websites to provide comprehensive usability feedback. Built with FastMCP and Playwright for realistic browser automation.

## 🚀 Features

### Core Tools
- **`visit_page(url)`** - Load and analyze webpage structure
- **`simulate_task(url, task_description, perspective)`** - Simulate user tasks with realistic behavior
- **`collect_feedback(url, perspective)`** - Generate structured usability feedback
- **`analyze_usability(urls, metrics)`** - Compare multiple pages across metrics
- **`generate_report(session_id, format)`** - Create comprehensive usability reports

### User Perspectives
- **new_user** - First-time visitors needing clear guidance
- **expert_user** - Power users wanting efficiency and advanced features
- **elderly_user** - Users preferring simple, clear interfaces
- **mobile_user** - Mobile-focused usability considerations

### Metrics
- **Clarity** - How clear and understandable the interface is
- **Speed** - Page load times and performance
- **Trust** - Security indicators and trustworthiness
- **Navigation** - Ease of finding and accessing content

## 📦 Installation

1. **Clone or create the project directory:**
```bash
mkdir synthetic-user-testing-mcp
cd synthetic-user-testing-mcp
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Install Playwright browsers:**
```bash
playwright install
```

## 🎯 Quick Start

### Running the Server
```bash
python server.py
```

The server will start and create the necessary data directories:
- `data/sessions/` - Individual test session data
- `data/reports/` - Generated usability reports
- `data/screenshots/` - Optional visual captures

### Basic Usage Examples

#### 1. Visit a Page
```python
# Tool call
result = await visit_page("https://example.com")

# Returns:
{
    "url": "https://example.com",
    "title": "Example Domain",
    "main_text": "This domain is for use in illustrative examples...",
    "navigation_elements": ["Home", "About", "Contact"],
    "load_time": 1.23,
    "timestamp": "2024-01-15T10:30:00"
}
```

#### 2. Simulate a Task
```python
# Tool call
result = await simulate_task(
    url="https://example.com",
    task_description="sign up for an account",
    perspective="new_user"
)

# Returns:
{
    "session_id": "abc123-def456",
    "success": false,
    "steps_taken": 3,
    "time_taken": 15.67,
    "steps_attempted": [
        "Looked for signup button",
        "Clicked on 'Login' link",
        "Could not find registration option"
    ],
    "error_message": "No clear signup option found"
}
```

#### 3. Collect Feedback
```python
# Tool call
result = await collect_feedback(
    url="https://example.com",
    perspective="new_user"
)

# Returns:
{
    "session_id": "xyz789-abc123",
    "positives": [
        "Page loads quickly",
        "Clear page title",
        "Good navigation structure"
    ],
    "negatives": [
        "Lacks clear guidance for new users",
        "No search functionality found"
    ],
    "overall_score": 6,
    "perspective": "new_user"
}
```

#### 4. Analyze Multiple Sites
```python
# Tool call
result = await analyze_usability(
    urls=["https://site1.com", "https://site2.com"],
    metrics=["clarity", "speed", "trust"]
)

# Returns comparative rankings and detailed analysis
```

#### 5. Generate Report
```python
# Tool call
result = await generate_report(format="markdown")

# Returns:
{
    "report_id": "report_123",
    "format": "markdown",
    "sessions_included": 5,
    "report_path": "/path/to/report_123.md",
    "content": "# Synthetic User Testing Report\n..."
}
```

## 📊 Example Workflow

### Complete Usability Test
```python
# 1. Test signup flow
signup_result = await simulate_task(
    "https://myapp.com",
    "create a new account",
    "new_user"
)

# 2. Collect feedback from different perspectives
new_user_feedback = await collect_feedback(
    "https://myapp.com",
    "new_user"
)

expert_feedback = await collect_feedback(
    "https://myapp.com",
    "expert_user"
)

# 3. Compare with competitors
comparison = await analyze_usability(
    urls=[
        "https://myapp.com",
        "https://competitor1.com",
        "https://competitor2.com"
    ],
    metrics=["clarity", "speed", "trust", "navigation"]
)

# 4. Generate comprehensive report
report = await generate_report(format="markdown")
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set custom data directory
export MCP_DATA_DIR="/path/to/custom/data"

# Optional: Set browser type (chromium, firefox, webkit)
export MCP_BROWSER_TYPE="chromium"

# Optional: Enable headful mode for debugging
export MCP_HEADLESS="false"
```

### Browser Settings
The server uses Playwright with these default settings:
- **Headless mode** - Runs without visible browser window
- **Viewport** - 1280x720 for consistent testing
- **User Agent** - Standard Chrome user agent
- **Timeout** - 30 seconds for page loads

## 📁 Data Structure

### Session Data
```json
{
    "session_id": "unique-session-id",
    "url": "https://tested-site.com",
    "task_description": "sign up for account",
    "task_result": {
        "success": false,
        "steps_taken": 3,
        "time_taken": 15.67,
        "steps_attempted": ["..."],
        "error_message": "..."
    },
    "feedback": {
        "positives": ["..."],
        "negatives": ["..."],
        "overall_score": 6,
        "perspective": "new_user"
    },
    "created_at": "2024-01-15T10:30:00"
}
```

### Report Structure
Markdown reports include:
- **Executive Summary** - Key metrics and success rates
- **Detailed Results** - Individual session breakdowns
- **Top Issues** - Most common usability problems
- **Recommendations** - Actionable improvement suggestions

## 🎭 Realistic User Behavior

The server simulates realistic user behavior including:

### Success Scenarios
- Finding elements quickly
- Following logical navigation paths
- Completing tasks efficiently

### Failure Scenarios
- Getting confused by unclear navigation
- Clicking wrong elements
- Giving up when tasks are too complex
- Missing important buttons or links

### Perspective-Based Behavior
- **New users** - More likely to get confused, need clear guidance
- **Expert users** - Look for shortcuts, advanced features
- **Elderly users** - Prefer simple interfaces, may struggle with complex layouts
- **Mobile users** - Focus on touch-friendly elements, concise content

## 🔍 MCP Resources

The server exposes these resources for browsing:

- **`/sessions/`** - List all test sessions
- **`/sessions/{session_id}`** - Get specific session details
- **`/reports/`** - List all generated reports

## 🚨 Error Handling

The server includes comprehensive error handling for:
- Network timeouts
- Invalid URLs
- Browser crashes
- Missing page elements
- Malformed requests

All errors are logged and returned in structured format for easy debugging.

## 🔒 Security Considerations

- Runs in sandboxed browser environment
- No persistent cookies or local storage
- No form submissions with real data
- Respects robots.txt (configurable)
- Rate limiting to avoid overwhelming target sites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Browser not found:**
```bash
playwright install
```

**Permission errors:**
```bash
chmod +x server.py
```

**Port already in use:**
The MCP server uses stdio communication, not HTTP ports.

**Slow performance:**
- Reduce viewport size
- Enable headless mode
- Limit concurrent sessions

### Debug Mode
Set environment variable for verbose logging:
```bash
export MCP_DEBUG="true"
python server.py
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs in `data/logs/`
3. Open an issue with detailed error information

---

**Happy Testing! 🎉**