#!/usr/bin/env python3
"""Convert HTML files to Markdown with code blocks"""

import os

def convert_html_to_md(html_file, md_file, title, description):
    """Convert HTML file to Markdown format"""
    print(f"Reading {html_file}...")
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Count lines
    line_count = len(html_content.split('\n'))
    
    print(f"Writing {md_file} ({line_count} lines)...")
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(f"# {title}\n\n")
        f.write(f"**Source File:** `{html_file}`  \n")
        f.write(f"**Total Lines:** {line_count:,}  \n")
        f.write(f"**{description}**\n\n")
        f.write("---\n\n")
        f.write("## Complete Source Code\n\n")
        f.write("This is the **EXACT** code from the file. Search through it to find any function, class, style, or element.\n\n")
        f.write("```html\n")
        f.write(html_content)
        f.write("\n```\n")
    
    print(f"✅ {md_file} created successfully!")

if __name__ == "__main__":
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Convert all HTML files
    convert_html_to_md(
        "mobile-index-COMPLETE.html",
        "mobile-index-COMPLETE.md",
        "Mobile Index - Complete Source Code",
        "This is the EXACT code from mobile/index.html - the complete mobile version with all HTML, CSS, and JavaScript."
    )
    
    convert_html_to_md(
        "desktop-COMPLETE.html",
        "desktop-COMPLETE.md",
        "Desktop - Complete Source Code",
        "This is the EXACT code from desktop.html - the complete desktop version with all HTML, CSS, and JavaScript."
    )
    
    convert_html_to_md(
        "admin-COMPLETE.html",
        "admin-COMPLETE.md",
        "Admin Panel - Complete Source Code",
        "This is the EXACT code from admin.html - the complete admin panel with all HTML, CSS, and JavaScript."
    )
    
    print("\n✅ All files converted!")

