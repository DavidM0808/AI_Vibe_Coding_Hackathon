#!/usr/bin/env python3
"""
Configuration settings for the Synthetic User Testing MCP Server.

This module contains all configurable settings for the server,
including browser settings, user personas, and testing parameters.
"""

import os
from typing import Dict, List, Any
from dataclasses import dataclass
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
SESSIONS_DIR = DATA_DIR / "sessions"
REPORTS_DIR = DATA_DIR / "reports"
SCREENSHOTS_DIR = DATA_DIR / "screenshots"

# Ensure directories exist
for directory in [DATA_DIR, SESSIONS_DIR, REPORTS_DIR, SCREENSHOTS_DIR]:
    directory.mkdir(exist_ok=True)

@dataclass
class BrowserConfig:
    """Browser configuration settings"""
    headless: bool = True
    viewport_width: int = 1280
    viewport_height: int = 720
    timeout: int = 30000  # 30 seconds
    user_agent: str = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    slow_mo: int = 100  # Milliseconds between actions
    
@dataclass
class UserPersona:
    """User persona configuration"""
    name: str
    description: str
    behavior_traits: List[str]
    success_rate: float  # 0.0 to 1.0
    average_time_multiplier: float  # How much longer they take
    confusion_probability: float  # Chance of getting confused
    
# User personas with realistic behavior patterns
USER_PERSONAS: Dict[str, UserPersona] = {
    "new_user": UserPersona(
        name="New User",
        description="First-time visitor, unfamiliar with the site",
        behavior_traits=[
            "Reads everything carefully",
            "Hesitates before clicking",
            "Looks for obvious visual cues",
            "Gets confused by complex navigation",
            "Expects clear instructions"
        ],
        success_rate=0.6,
        average_time_multiplier=2.0,
        confusion_probability=0.3
    ),
    
    "expert_user": UserPersona(
        name="Expert User",
        description="Experienced user who knows what they want",
        behavior_traits=[
            "Scans quickly for relevant information",
            "Uses keyboard shortcuts when available",
            "Expects advanced features",
            "Frustrated by unnecessary steps",
            "Knows common UI patterns"
        ],
        success_rate=0.9,
        average_time_multiplier=0.7,
        confusion_probability=0.1
    ),
    
    "elderly_user": UserPersona(
        name="Elderly User",
        description="Older user who may need more time and clearer interfaces",
        behavior_traits=[
            "Prefers larger text and buttons",
            "Takes time to read everything",
            "Cautious about clicking unknown elements",
            "May struggle with small touch targets",
            "Values simplicity over features"
        ],
        success_rate=0.5,
        average_time_multiplier=3.0,
        confusion_probability=0.4
    ),
    
    "mobile_user": UserPersona(
        name="Mobile User",
        description="User on mobile device with different interaction patterns",
        behavior_traits=[
            "Uses touch gestures",
            "Expects mobile-optimized interface",
            "May have slower connection",
            "Scrolls more than clicks",
            "Frustrated by non-responsive design"
        ],
        success_rate=0.7,
        average_time_multiplier=1.5,
        confusion_probability=0.25
    ),
    
    "power_user": UserPersona(
        name="Power User",
        description="Advanced user who wants efficiency and control",
        behavior_traits=[
            "Uses advanced features",
            "Expects customization options",
            "Values speed and efficiency",
            "May use browser extensions",
            "Frustrated by limitations"
        ],
        success_rate=0.95,
        average_time_multiplier=0.5,
        confusion_probability=0.05
    )
}

# Common task patterns and their difficulty levels
TASK_PATTERNS: Dict[str, Dict[str, Any]] = {
    "signup": {
        "keywords": ["sign up", "register", "create account", "join"],
        "target_elements": ["signup", "register", "join", "create"],
        "difficulty": "medium",
        "common_issues": [
            "Signup button hard to find",
            "Form validation unclear",
            "Too many required fields",
            "Email verification confusing"
        ]
    },
    
    "login": {
        "keywords": ["log in", "sign in", "login", "signin"],
        "target_elements": ["login", "signin", "sign-in"],
        "difficulty": "easy",
        "common_issues": [
            "Login form not prominent",
            "Forgot password link unclear",
            "Error messages unhelpful"
        ]
    },
    
    "contact": {
        "keywords": ["contact", "contact us", "get in touch", "support"],
        "target_elements": ["contact", "support", "help"],
        "difficulty": "easy",
        "common_issues": [
            "Contact information buried",
            "No phone number provided",
            "Contact form too complex"
        ]
    },
    
    "search": {
        "keywords": ["search", "find", "look for"],
        "target_elements": ["search", "find", "query"],
        "difficulty": "easy",
        "common_issues": [
            "Search box not visible",
            "Search results poor quality",
            "No search suggestions"
        ]
    },
    
    "purchase": {
        "keywords": ["buy", "purchase", "order", "checkout", "cart"],
        "target_elements": ["buy", "purchase", "cart", "checkout", "order"],
        "difficulty": "hard",
        "common_issues": [
            "Checkout process too long",
            "Unexpected costs at checkout",
            "Payment options limited",
            "Shipping information unclear"
        ]
    },
    
    "navigation": {
        "keywords": ["navigate", "browse", "explore", "menu"],
        "target_elements": ["menu", "nav", "navigation"],
        "difficulty": "medium",
        "common_issues": [
            "Navigation menu confusing",
            "Too many menu levels",
            "Mobile menu hard to use",
            "Breadcrumbs missing"
        ]
    }
}

# Feedback templates for different scenarios
FEEDBACK_TEMPLATES: Dict[str, Dict[str, List[str]]] = {
    "positive": {
        "performance": [
            "Page loads quickly",
            "Smooth animations and transitions",
            "Responsive design works well",
            "Fast search results"
        ],
        "usability": [
            "Clear navigation structure",
            "Intuitive user interface",
            "Easy to find what I need",
            "Good visual hierarchy",
            "Helpful error messages"
        ],
        "content": [
            "Clear and concise content",
            "Good use of headings",
            "Relevant information provided",
            "Well-organized layout"
        ],
        "accessibility": [
            "Good color contrast",
            "Text is readable",
            "Buttons are appropriately sized",
            "Alt text provided for images"
        ]
    },
    
    "negative": {
        "performance": [
            "Page takes too long to load",
            "Images load slowly",
            "Site feels sluggish",
            "Frequent timeouts"
        ],
        "usability": [
            "Navigation is confusing",
            "Too many clicks required",
            "Search functionality poor",
            "Mobile experience lacking",
            "Error messages unhelpful"
        ],
        "content": [
            "Information hard to find",
            "Content is outdated",
            "Too much text without structure",
            "Missing important details"
        ],
        "accessibility": [
            "Text too small to read",
            "Poor color contrast",
            "Buttons too small for touch",
            "No alt text for images",
            "Not keyboard accessible"
        ]
    }
}

# Usability metrics and their weights
USABILITY_METRICS: Dict[str, Dict[str, Any]] = {
    "clarity": {
        "weight": 0.25,
        "description": "How clear and understandable the interface is",
        "factors": ["navigation clarity", "content organization", "visual hierarchy"]
    },
    "speed": {
        "weight": 0.20,
        "description": "How fast the site loads and responds",
        "factors": ["page load time", "interaction responsiveness", "search speed"]
    },
    "trust": {
        "weight": 0.20,
        "description": "How trustworthy and professional the site appears",
        "factors": ["design quality", "security indicators", "contact information"]
    },
    "accessibility": {
        "weight": 0.15,
        "description": "How accessible the site is to all users",
        "factors": ["color contrast", "text size", "keyboard navigation"]
    },
    "mobile_friendliness": {
        "weight": 0.20,
        "description": "How well the site works on mobile devices",
        "factors": ["responsive design", "touch targets", "mobile navigation"]
    }
}

# Server configuration
class ServerConfig:
    """Server configuration settings"""
    
    # Browser settings
    BROWSER = BrowserConfig()
    
    # Data storage
    MAX_SESSIONS = int(os.getenv("MAX_SESSIONS", "1000"))
    SESSION_TIMEOUT = int(os.getenv("SESSION_TIMEOUT", "3600"))  # 1 hour
    
    # Testing settings
    DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", "30"))  # seconds
    MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = os.getenv("LOG_FILE", str(BASE_DIR / "server.log"))
    
    # Screenshots
    TAKE_SCREENSHOTS = os.getenv("TAKE_SCREENSHOTS", "true").lower() == "true"
    SCREENSHOT_ON_ERROR = os.getenv("SCREENSHOT_ON_ERROR", "true").lower() == "true"
    
    # Report settings
    DEFAULT_REPORT_FORMAT = os.getenv("DEFAULT_REPORT_FORMAT", "markdown")
    INCLUDE_SCREENSHOTS_IN_REPORTS = os.getenv("INCLUDE_SCREENSHOTS_IN_REPORTS", "true").lower() == "true"

# Export commonly used paths
__all__ = [
    "BASE_DIR",
    "DATA_DIR", 
    "SESSIONS_DIR",
    "REPORTS_DIR",
    "SCREENSHOTS_DIR",
    "BrowserConfig",
    "UserPersona",
    "USER_PERSONAS",
    "TASK_PATTERNS",
    "FEEDBACK_TEMPLATES",
    "USABILITY_METRICS",
    "ServerConfig"
]