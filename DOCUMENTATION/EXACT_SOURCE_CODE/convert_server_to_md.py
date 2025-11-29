#!/usr/bin/env python3
"""Convert server.py to Markdown"""

with open('server-COMPLETE.py', 'r', encoding='utf-8') as f:
    py_content = f.read()

line_count = len(py_content.split('\n'))

with open('server-COMPLETE.md', 'w', encoding='utf-8') as f:
    f.write('# Server - Complete Backend Source Code\n\n')
    f.write('**Source File:** `server.py`  \n')
    f.write(f'**Total Lines:** {line_count:,}  \n')
    f.write('**This is the EXACT code from the Flask backend server.**\n\n')
    f.write('---\n\n')
    f.write('## Complete Python Server Code\n\n')
    f.write('This is the **EXACT** Flask backend server code. All API endpoints, file processing, and business logic.\n\n')
    f.write('```python\n')
    f.write(py_content)
    f.write('\n```\n')

print(f'✅ Server markdown created ({line_count} lines)')

