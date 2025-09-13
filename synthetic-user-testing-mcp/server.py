#!/usr/bin/env python3
"""
Synthetic User Testing MCP Server

A Model Context Protocol server that simulates users interacting with websites
and provides structured feedback for usability testing.
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from fastmcp import FastMCP
from playwright.async_api import async_playwright, Browser, Page
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models
class TaskResult(BaseModel):
    success: bool
    steps_taken: int
    time_taken: float
    steps_attempted: List[str]
    error_message: Optional[str] = None

class Feedback(BaseModel):
    positives: List[str]
    negatives: List[str]
    overall_score: int  # 1-10
    perspective: str
    timestamp: datetime

class Session(BaseModel):
    session_id: str
    url: str
    task_description: Optional[str] = None
    task_result: Optional[TaskResult] = None
    feedback: Optional[Feedback] = None
    screenshots: List[str] = []
    created_at: datetime

class UserTester:
    """Handles browser automation and user simulation"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.sessions: Dict[str, Session] = {}
        self.data_dir = Path("./data")
        self.data_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.data_dir / "sessions").mkdir(exist_ok=True)
        (self.data_dir / "screenshots").mkdir(exist_ok=True)
        (self.data_dir / "reports").mkdir(exist_ok=True)
    
    async def start_browser(self):
        """Initialize Playwright browser"""
        if not self.browser:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(headless=True)
            logger.info("Browser started")
    
    async def stop_browser(self):
        """Close browser"""
        if self.browser:
            await self.browser.close()
            self.browser = None
            logger.info("Browser stopped")
    
    async def visit_page(self, url: str) -> Dict[str, Any]:
        """Visit a webpage and extract basic information"""
        await self.start_browser()
        
        context = await self.browser.new_context()
        page = await context.new_page()
        
        try:
            start_time = datetime.now()
            await page.goto(url, wait_until="networkidle")
            load_time = (datetime.now() - start_time).total_seconds()
            
            # Extract page information
            title = await page.title()
            
            # Get main text content
            main_text = await page.evaluate("""
                () => {
                    const content = document.querySelector('main') || document.body;
                    return content ? content.innerText.slice(0, 1000) : '';
                }
            """)
            
            # Get navigation elements
            nav_elements = await page.evaluate("""
                () => {
                    const navs = document.querySelectorAll('nav a, .nav a, .navigation a, header a');
                    return Array.from(navs).slice(0, 10).map(a => a.textContent?.trim()).filter(Boolean);
                }
            """)
            
            # Take screenshot
            screenshot_path = self.data_dir / "screenshots" / f"{uuid.uuid4()}.png"
            await page.screenshot(path=str(screenshot_path))
            
            return {
                "title": title,
                "url": url,
                "load_time": load_time,
                "main_text": main_text,
                "navigation_elements": nav_elements,
                "screenshot": str(screenshot_path)
            }
            
        except Exception as e:
            logger.error(f"Error visiting page {url}: {e}")
            return {
                "error": str(e),
                "url": url
            }
        finally:
            await context.close()

# Initialize the MCP server
mcp = FastMCP("Synthetic User Testing")
tester = UserTester()

@mcp.tool()
async def visit_page(url: str) -> Dict[str, Any]:
    """
    Visit a webpage and return structured information about it.
    
    Args:
        url: The URL to visit
        
    Returns:
        Dictionary containing page title, main text, navigation elements, and metadata
    """
    return await tester.visit_page(url)

@mcp.tool()
async def collect_feedback(url: str, perspective: str = "new_user") -> Dict[str, Any]:
    """
    Generate feedback after interacting with a website from a specific user perspective.
    
    Args:
        url: The URL that was tested
        perspective: User perspective ("new_user", "expert_user", "elderly_user", "mobile_user")
        
    Returns:
        Dictionary containing structured feedback with positives, negatives, and overall score
    """
    # Visit the page to gather information for feedback
    page_info = await tester.visit_page(url)
    
    if "error" in page_info:
        return {
            "error": "Could not access page for feedback collection",
            "url": url
        }
    
    # Generate perspective-based feedback
    feedback = _generate_feedback(page_info, perspective)
    
    # Store feedback
    session_id = str(uuid.uuid4())
    session = Session(
        session_id=session_id,
        url=url,
        feedback=feedback,
        created_at=datetime.now()
    )
    
    tester.sessions[session_id] = session
    
    # Save session data
    session_file = tester.data_dir / "sessions" / f"{session_id}.json"
    with open(session_file, 'w') as f:
        json.dump(session.dict(), f, indent=2, default=str)
    
    return {
        "session_id": session_id,
        "url": url,
        "perspective": perspective,
        "positives": feedback.positives,
        "negatives": feedback.negatives,
        "overall_score": feedback.overall_score,
        "timestamp": feedback.timestamp.isoformat()
    }

def _generate_feedback(page_info: Dict[str, Any], perspective: str) -> Feedback:
    """Generate realistic feedback based on page information and user perspective"""
    positives = []
    negatives = []
    score = 5  # Base score
    
    # Analyze load time
    load_time = page_info.get("load_time", 0)
    if load_time < 2:
        positives.append("Page loads quickly")
        score += 1
    elif load_time > 5:
        negatives.append("Page takes too long to load")
        score -= 1
    
    # Analyze title
    title = page_info.get("title", "")
    if title and len(title) > 10:
        positives.append("Clear page title")
    else:
        negatives.append("Missing or unclear page title")
        score -= 1
    
    # Analyze navigation
    nav_elements = page_info.get("navigation_elements", [])
    if len(nav_elements) >= 3:
        positives.append("Good navigation structure")
        score += 1
    elif len(nav_elements) < 2:
        negatives.append("Limited navigation options")
        score -= 1
    
    # Analyze content
    main_text = page_info.get("main_text", "")
    if len(main_text) > 100:
        positives.append("Sufficient content available")
    else:
        negatives.append("Limited content on page")
        score -= 1
    
    # Perspective-specific feedback
    if perspective == "new_user":
        # New users need clear guidance
        if "welcome" in main_text.lower() or "get started" in main_text.lower():
            positives.append("Welcoming content for new users")
        else:
            negatives.append("Lacks clear guidance for new users")
            score -= 1
        
        # New users might be overwhelmed by too many options
        if len(nav_elements) > 8:
            negatives.append("Too many navigation options might confuse new users")
            score -= 1
    
    elif perspective == "expert_user":
        # Expert users want efficiency
        if len(nav_elements) >= 5:
            positives.append("Comprehensive navigation for power users")
        else:
            negatives.append("Limited options for advanced users")
            score -= 1
        
        # Expert users appreciate shortcuts
        if "search" in str(nav_elements).lower():
            positives.append("Search functionality available")
        else:
            negatives.append("No search functionality found")
            score -= 1
    
    elif perspective == "elderly_user":
        # Elderly users need larger, clearer elements
        negatives.append("Cannot assess text size and contrast from automation")
        score -= 1
        
        # Prefer simpler navigation
        if len(nav_elements) <= 5:
            positives.append("Simple, uncluttered navigation")
        else:
            negatives.append("Navigation might be too complex")
            score -= 1
    
    elif perspective == "mobile_user":
        # Mobile users need responsive design
        negatives.append("Cannot assess mobile responsiveness from desktop automation")
        score -= 1
        
        # Mobile users prefer concise content
        if len(main_text) < 500:
            positives.append("Concise content suitable for mobile")
        else:
            negatives.append("Content might be too lengthy for mobile")
            score -= 1
    
    # Ensure score is within bounds
    score = max(1, min(10, score))
    
    # Add some randomness to simulate real user variability
    import random
    if random.random() < 0.3:  # 30% chance of additional random feedback
        random_negatives = [
            "Button placement could be improved",
            "Color scheme feels outdated",
            "Some text is hard to read",
            "Layout feels cluttered"
        ]
        negatives.append(random.choice(random_negatives))
        score = max(1, score - 1)
    
    return Feedback(
        positives=positives,
        negatives=negatives,
        overall_score=score,
        perspective=perspective,
        timestamp=datetime.now()
    )

@mcp.tool()
async def simulate_task(url: str, task_description: str, perspective: str = "new_user") -> Dict[str, Any]:
    """
    Simulate a user attempting to complete a specific task on a website.
    
    Args:
        url: The URL to test
        task_description: Description of the task to attempt (e.g., "sign up", "find contact info")
        perspective: User perspective ("new_user", "expert_user", "elderly_user", "mobile_user")
        
    Returns:
        Dictionary containing task success status, steps taken, and detailed results
    """
    session_id = str(uuid.uuid4())
    session = Session(
        session_id=session_id,
        url=url,
        task_description=task_description,
        created_at=datetime.now()
    )
    
    await tester.start_browser()
    context = await tester.browser.new_context()
    page = await context.new_page()
    
    steps_attempted = []
    start_time = datetime.now()
    success = False
    error_message = None
    
    try:
        # Navigate to page
        await page.goto(url, wait_until="networkidle")
        steps_attempted.append(f"Navigated to {url}")
        
        # Simulate task based on description and perspective
        if "sign up" in task_description.lower():
            success, task_steps = await _simulate_signup_task(page, perspective)
            steps_attempted.extend(task_steps)
        elif "contact" in task_description.lower():
            success, task_steps = await _simulate_contact_task(page, perspective)
            steps_attempted.extend(task_steps)
        elif "search" in task_description.lower():
            success, task_steps = await _simulate_search_task(page, perspective)
            steps_attempted.extend(task_steps)
        else:
            # Generic task simulation
            success, task_steps = await _simulate_generic_task(page, task_description, perspective)
            steps_attempted.extend(task_steps)
            
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error during task simulation: {e}")
        steps_attempted.append(f"Error occurred: {e}")
    
    finally:
        await context.close()
    
    time_taken = (datetime.now() - start_time).total_seconds()
    
    task_result = TaskResult(
        success=success,
        steps_taken=len(steps_attempted),
        time_taken=time_taken,
        steps_attempted=steps_attempted,
        error_message=error_message
    )
    
    session.task_result = task_result
    tester.sessions[session_id] = session
    
    # Save session data
    session_file = tester.data_dir / "sessions" / f"{session_id}.json"
    with open(session_file, 'w') as f:
        json.dump(session.dict(), f, indent=2, default=str)
    
    return {
        "session_id": session_id,
        "success": success,
        "steps_taken": len(steps_attempted),
        "time_taken": time_taken,
        "steps_attempted": steps_attempted,
        "error_message": error_message
    }

async def _simulate_signup_task(page: Page, perspective: str) -> tuple[bool, List[str]]:
    """Simulate signup task with realistic user behavior"""
    steps = []
    
    try:
        # Look for signup button/link
        signup_selectors = [
            'a[href*="signup"]', 'a[href*="register"]', 'button:has-text("Sign Up")',
            'button:has-text("Register")', '.signup', '.register', '#signup', '#register'
        ]
        
        signup_found = False
        for selector in signup_selectors:
            try:
                element = await page.wait_for_selector(selector, timeout=2000)
                if element:
                    await element.click()
                    steps.append(f"Clicked signup element: {selector}")
                    signup_found = True
                    break
            except:
                continue
        
        if not signup_found:
            # Simulate user confusion - try navigation menu
            steps.append("Could not find obvious signup button")
            
            # Try clicking on common navigation items
            nav_items = await page.query_selector_all('nav a, .nav a, header a')
            for item in nav_items[:3]:  # Only try first 3
                text = await item.inner_text()
                if any(word in text.lower() for word in ['sign', 'register', 'join', 'account']):
                    await item.click()
                    steps.append(f"Tried navigation item: {text}")
                    break
            else:
                steps.append("Failed to find signup in navigation")
                return False, steps
        
        # Wait for potential form
        await page.wait_for_timeout(1000)
        
        # Look for form fields
        email_field = await page.query_selector('input[type="email"], input[name*="email"], input[placeholder*="email"]')
        if email_field:
            # Simulate realistic user behavior based on perspective
            if perspective == "new_user":
                # New users might be more cautious, read more
                await page.wait_for_timeout(2000)
                steps.append("New user taking time to read form")
            
            await email_field.fill("test@example.com")
            steps.append("Filled email field")
            
            # Look for password field
            password_field = await page.query_selector('input[type="password"]')
            if password_field:
                await password_field.fill("TestPassword123!")
                steps.append("Filled password field")
                
                # Submit form
                submit_button = await page.query_selector('button[type="submit"], input[type="submit"], button:has-text("Sign Up")')
                if submit_button:
                    await submit_button.click()
                    steps.append("Clicked submit button")
                    
                    # Wait for response
                    await page.wait_for_timeout(3000)
                    
                    # Check for success indicators
                    success_indicators = await page.query_selector_all('.success, .welcome, .confirmation')
                    if success_indicators or "welcome" in (await page.content()).lower():
                        steps.append("Signup appears successful")
                        return True, steps
                    else:
                        steps.append("Signup form submitted but no clear success indication")
                        return False, steps
        
        steps.append("Could not complete signup process")
        return False, steps
        
    except Exception as e:
        steps.append(f"Error during signup simulation: {e}")
        return False, steps

async def _simulate_contact_task(page: Page, perspective: str) -> tuple[bool, List[str]]:
    """Simulate finding contact information"""
    steps = []
    
    try:
        # Look for contact links
        contact_selectors = [
            'a[href*="contact"]', 'a:has-text("Contact")', 'a:has-text("Contact Us")',
            '.contact', '#contact', 'a[href*="about"]'
        ]
        
        for selector in contact_selectors:
            try:
                element = await page.wait_for_selector(selector, timeout=2000)
                if element:
                    await element.click()
                    steps.append(f"Clicked contact link: {selector}")
                    await page.wait_for_timeout(1000)
                    
                    # Look for contact information
                    content = await page.content()
                    if any(indicator in content.lower() for indicator in ['email', 'phone', '@', 'tel:', 'mailto:']):
                        steps.append("Found contact information")
                        return True, steps
                    break
            except:
                continue
        
        # Try footer
        footer = await page.query_selector('footer')
        if footer:
            footer_text = await footer.inner_text()
            if any(indicator in footer_text.lower() for indicator in ['email', 'phone', '@']):
                steps.append("Found contact info in footer")
                return True, steps
        
        steps.append("Could not find contact information")
        return False, steps
        
    except Exception as e:
        steps.append(f"Error during contact search: {e}")
        return False, steps

async def _simulate_search_task(page: Page, perspective: str) -> tuple[bool, List[str]]:
    """Simulate using search functionality"""
    steps = []
    
    try:
        # Look for search input
        search_selectors = [
            'input[type="search"]', 'input[placeholder*="search"]', 
            '.search input', '#search', '.search-box input'
        ]
        
        for selector in search_selectors:
            try:
                search_input = await page.wait_for_selector(selector, timeout=2000)
                if search_input:
                    await search_input.fill("test query")
                    steps.append(f"Entered search query in: {selector}")
                    
                    # Try to submit
                    await search_input.press('Enter')
                    steps.append("Pressed Enter to search")
                    
                    await page.wait_for_timeout(2000)
                    
                    # Check for results
                    results = await page.query_selector_all('.result, .search-result, .results li')
                    if results:
                        steps.append(f"Found {len(results)} search results")
                        return True, steps
                    break
            except:
                continue
        
        steps.append("Could not find or use search functionality")
        return False, steps
        
    except Exception as e:
        steps.append(f"Error during search simulation: {e}")
        return False, steps

async def _simulate_generic_task(page: Page, task_description: str, perspective: str) -> tuple[bool, List[str]]:
    """Simulate a generic task based on description"""
    steps = []
    
    try:
        # Extract keywords from task description
        keywords = task_description.lower().split()
        
        # Look for relevant links/buttons
        all_links = await page.query_selector_all('a, button')
        
        for link in all_links[:10]:  # Limit to first 10 to simulate realistic behavior
            try:
                text = await link.inner_text()
                if any(keyword in text.lower() for keyword in keywords):
                    await link.click()
                    steps.append(f"Clicked element with text: {text}")
                    await page.wait_for_timeout(1000)
                    
                    # Simple success check - if page changed
                    current_url = page.url
                    if current_url != page.url:
                        steps.append("Page navigation occurred")
                        return True, steps
                    break
            except:
                continue
        
        steps.append(f"Could not complete task: {task_description}")
        return False, steps
        
    except Exception as e:
        steps.append(f"Error during generic task simulation: {e}")
        return False, steps

@mcp.tool()
async def analyze_usability(urls: List[str], metrics: List[str] = ["clarity", "speed", "trust"]) -> Dict[str, Any]:
    """
    Compare multiple pages or flows and rank them on given metrics.
    
    Args:
        urls: List of URLs to compare
        metrics: List of metrics to evaluate ("clarity", "speed", "trust", "navigation")
        
    Returns:
        Dictionary containing comparative analysis and rankings
    """
    if len(urls) > 5:
        return {"error": "Maximum 5 URLs allowed for comparison"}
    
    results = []
    
    for url in urls:
        try:
            # Visit page and collect feedback
            page_info = await tester.visit_page(url)
            if "error" in page_info:
                continue
            
            feedback = _generate_feedback(page_info, "expert_user")
            
            # Calculate metric scores
            scores = {}
            
            if "clarity" in metrics:
                clarity_score = 5
                if page_info.get("title"):
                    clarity_score += 2
                if len(page_info.get("navigation_elements", [])) >= 3:
                    clarity_score += 2
                if len(page_info.get("main_text", "")) > 100:
                    clarity_score += 1
                scores["clarity"] = min(10, clarity_score)
            
            if "speed" in metrics:
                load_time = page_info.get("load_time", 5)
                if load_time < 1:
                    scores["speed"] = 10
                elif load_time < 2:
                    scores["speed"] = 8
                elif load_time < 3:
                    scores["speed"] = 6
                elif load_time < 5:
                    scores["speed"] = 4
                else:
                    scores["speed"] = 2
            
            if "trust" in metrics:
                trust_score = 5
                if "https" in url:
                    trust_score += 2
                if any(word in page_info.get("main_text", "").lower() 
                       for word in ["privacy", "security", "terms"]):
                    trust_score += 2
                if page_info.get("title"):
                    trust_score += 1
                scores["trust"] = min(10, trust_score)
            
            if "navigation" in metrics:
                nav_count = len(page_info.get("navigation_elements", []))
                if nav_count >= 5:
                    scores["navigation"] = 9
                elif nav_count >= 3:
                    scores["navigation"] = 7
                elif nav_count >= 1:
                    scores["navigation"] = 5
                else:
                    scores["navigation"] = 2
            
            results.append({
                "url": url,
                "scores": scores,
                "overall_score": feedback.overall_score,
                "load_time": page_info.get("load_time", 0)
            })
            
        except Exception as e:
            logger.error(f"Error analyzing {url}: {e}")
            continue
    
    # Rank results
    rankings = {}
    for metric in metrics:
        ranked = sorted(results, key=lambda x: x["scores"].get(metric, 0), reverse=True)
        rankings[metric] = [{
            "rank": i + 1,
            "url": item["url"],
            "score": item["scores"].get(metric, 0)
        } for i, item in enumerate(ranked)]
    
    # Overall ranking
    overall_ranked = sorted(results, key=lambda x: x["overall_score"], reverse=True)
    rankings["overall"] = [{
        "rank": i + 1,
        "url": item["url"],
        "score": item["overall_score"]
    } for i, item in enumerate(overall_ranked)]
    
    return {
        "metrics_analyzed": metrics,
        "total_urls": len(results),
        "rankings": rankings,
        "detailed_results": results,
        "analysis_summary": _generate_analysis_summary(results, metrics)
    }

def _generate_analysis_summary(results: List[Dict], metrics: List[str]) -> str:
    """Generate natural language summary of usability analysis"""
    if not results:
        return "No valid results to analyze."
    
    summary_parts = []
    
    # Best performing site
    best_site = max(results, key=lambda x: x["overall_score"])
    summary_parts.append(f"Best performing site: {best_site['url']} (score: {best_site['overall_score']}/10)")
    
    # Speed analysis
    if "speed" in metrics:
        fastest = min(results, key=lambda x: x["load_time"])
        summary_parts.append(f"Fastest loading: {fastest['url']} ({fastest['load_time']:.2f}s)")
    
    # Common issues
    avg_score = sum(r["overall_score"] for r in results) / len(results)
    if avg_score < 6:
        summary_parts.append("Overall usability scores are below average - consider UX improvements")
    
    return ". ".join(summary_parts) + "."

@mcp.tool()
async def generate_report(session_id: str = None, format: str = "markdown") -> Dict[str, Any]:
    """
    Generate a comprehensive usability report from session data.
    
    Args:
        session_id: Specific session to report on (if None, aggregates all recent sessions)
        format: Report format ("markdown", "json")
        
    Returns:
        Dictionary containing the generated report
    """
    if session_id and session_id in tester.sessions:
        sessions = [tester.sessions[session_id]]
    else:
        # Get all sessions from the last 24 hours
        recent_sessions = []
        cutoff_time = datetime.now().timestamp() - (24 * 60 * 60)  # 24 hours ago
        
        for session in tester.sessions.values():
            if session.created_at.timestamp() > cutoff_time:
                recent_sessions.append(session)
        
        sessions = recent_sessions
    
    if not sessions:
        return {"error": "No sessions found for report generation"}
    
    if format == "markdown":
        report_content = _generate_markdown_report(sessions)
    else:
        report_content = _generate_json_report(sessions)
    
    # Save report
    report_id = str(uuid.uuid4())
    report_filename = f"report_{report_id}.{format}"
    report_path = tester.data_dir / "reports" / report_filename
    
    with open(report_path, 'w') as f:
        f.write(report_content)
    
    return {
        "report_id": report_id,
        "format": format,
        "sessions_included": len(sessions),
        "report_path": str(report_path),
        "content": report_content
    }

def _generate_markdown_report(sessions: List[Session]) -> str:
    """Generate a markdown usability report"""
    report = []
    report.append("# Synthetic User Testing Report")
    report.append(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"\nSessions analyzed: {len(sessions)}")
    report.append("\n---\n")
    
    # Executive Summary
    report.append("## Executive Summary")
    
    successful_tasks = sum(1 for s in sessions if s.task_result and s.task_result.success)
    total_tasks = sum(1 for s in sessions if s.task_result)
    
    if total_tasks > 0:
        success_rate = (successful_tasks / total_tasks) * 100
        report.append(f"\n- Task Success Rate: {success_rate:.1f}% ({successful_tasks}/{total_tasks})")
    
    # Collect all feedback
    all_positives = []
    all_negatives = []
    scores = []
    
    for session in sessions:
        if session.feedback:
            all_positives.extend(session.feedback.positives)
            all_negatives.extend(session.feedback.negatives)
            scores.append(session.feedback.overall_score)
    
    if scores:
        avg_score = sum(scores) / len(scores)
        report.append(f"- Average User Satisfaction: {avg_score:.1f}/10")
    
    # Top Issues
    if all_negatives:
        from collections import Counter
        common_issues = Counter(all_negatives).most_common(3)
        report.append("\n### Top Issues:")
        for issue, count in common_issues:
            report.append(f"- {issue} (mentioned {count} times)")
    
    # Detailed Session Results
    report.append("\n## Detailed Results")
    
    for i, session in enumerate(sessions, 1):
        report.append(f"\n### Session {i}: {session.url}")
        report.append(f"\n**Created:** {session.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if session.task_description:
            report.append(f"\n**Task:** {session.task_description}")
        
        if session.task_result:
            result = session.task_result
            status = "✅ Success" if result.success else "❌ Failed"
            report.append(f"\n**Result:** {status}")
            report.append(f"\n**Steps taken:** {result.steps_taken}")
            report.append(f"\n**Time taken:** {result.time_taken:.2f} seconds")
            
            if result.steps_attempted:
                report.append("\n**Steps attempted:**")
                for step in result.steps_attempted:
                    report.append(f"- {step}")
            
            if result.error_message:
                report.append(f"\n**Error:** {result.error_message}")
        
        if session.feedback:
            feedback = session.feedback
            report.append(f"\n**User Perspective:** {feedback.perspective}")
            report.append(f"\n**Overall Score:** {feedback.overall_score}/10")
            
            if feedback.positives:
                report.append("\n**Positives:**")
                for positive in feedback.positives:
                    report.append(f"- ✅ {positive}")
            
            if feedback.negatives:
                report.append("\n**Issues:**")
                for negative in feedback.negatives:
                    report.append(f"- ❌ {negative}")
        
        report.append("\n---")
    
    # Recommendations
    report.append("\n## Recommendations")
    
    if total_tasks > 0 and success_rate < 70:
        report.append("\n- **Critical:** Task success rate is below 70%. Review user flows and simplify key actions.")
    
    if scores and avg_score < 6:
        report.append("\n- **Important:** User satisfaction is below average. Focus on addressing common usability issues.")
    
    if all_negatives:
        most_common_issue = Counter(all_negatives).most_common(1)[0]
        report.append(f"\n- **Priority:** Address '{most_common_issue[0]}' as it was the most frequently reported issue.")
    
    report.append("\n- **General:** Continue regular usability testing to monitor improvements.")
    
    return "\n".join(report)

def _generate_json_report(sessions: List[Session]) -> str:
    """Generate a JSON usability report"""
    report_data = {
        "generated_at": datetime.now().isoformat(),
        "sessions_count": len(sessions),
        "sessions": [session.dict() for session in sessions]
    }
    
    # Add summary statistics
    successful_tasks = sum(1 for s in sessions if s.task_result and s.task_result.success)
    total_tasks = sum(1 for s in sessions if s.task_result)
    
    scores = [s.feedback.overall_score for s in sessions if s.feedback]
    
    report_data["summary"] = {
        "task_success_rate": (successful_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        "average_satisfaction_score": sum(scores) / len(scores) if scores else 0,
        "total_tasks_attempted": total_tasks,
        "successful_tasks": successful_tasks
    }
    
    return json.dumps(report_data, indent=2, default=str)

# Resource handlers for MCP
@mcp.resource("file://sessions/{session_id}")
async def get_session(session_id: str) -> str:
    """Get detailed information about a specific session"""
    if session_id in tester.sessions:
        session = tester.sessions[session_id]
        return json.dumps(session.dict(), indent=2, default=str)
    else:
        return json.dumps({"error": "Session not found"})

@mcp.resource("file://sessions/")
async def list_sessions() -> str:
    """List all available sessions"""
    session_list = []
    for session_id, session in tester.sessions.items():
        session_list.append({
            "session_id": session_id,
            "url": session.url,
            "created_at": session.created_at.isoformat(),
            "has_task_result": session.task_result is not None,
            "has_feedback": session.feedback is not None
        })
    
    return json.dumps({
        "total_sessions": len(session_list),
        "sessions": session_list
    }, indent=2)

@mcp.resource("file://reports/")
async def list_reports() -> str:
    """List all generated reports"""
    reports_dir = tester.data_dir / "reports"
    reports = []
    
    if reports_dir.exists():
        for report_file in reports_dir.glob("*.md"):
            reports.append({
                "filename": report_file.name,
                "path": str(report_file),
                "created_at": datetime.fromtimestamp(report_file.stat().st_mtime).isoformat(),
                "size_bytes": report_file.stat().st_size
            })
    
    return json.dumps({
        "total_reports": len(reports),
        "reports": reports
    }, indent=2)

# Cleanup function
async def cleanup():
    """Cleanup resources when server shuts down"""
    await tester.stop_browser()
    logger.info("Cleanup completed")

if __name__ == "__main__":
    import atexit
    atexit.register(lambda: asyncio.run(cleanup()))
    mcp.run()