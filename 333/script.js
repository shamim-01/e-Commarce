// script.js - Compact Version
document.addEventListener('DOMContentLoaded', function () {
  // ==================== NAVIGATION ====================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ==================== COPY BUTTONS ====================
  const copyButtons = document.querySelectorAll('.compact-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', function () {
      const cheatsheetCard = this.closest('.cheatsheet-card');
      if (!cheatsheetCard) return;

      const codeElement = cheatsheetCard.querySelector('code');
      if (!codeElement) return;

      const codeText = codeElement.textContent;

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(codeText)
          .then(() => {
            showCopyFeedback(this, 'Copied!');
          })
          .catch(err => {
            console.error('Copy failed:', err);
            fallbackCopyTextToClipboard(codeText, this);
          });
      } else {
        fallbackCopyTextToClipboard(codeText, this);
      }
    });
  });

  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopyFeedback(button, 'Copied!');
      } else {
        showCopyFeedback(button, 'Failed to copy');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showCopyFeedback(button, 'Failed to copy');
    }

    document.body.removeChild(textArea);
  }

  function showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;

    setTimeout(() => {
      button.textContent = originalText;
    }, 1500);
  }

  // ==================== PLAYGROUND ====================
  const editorTabs = document.querySelectorAll('.editor-tab');
  const editorPanes = document.querySelectorAll('.editor-pane');
  const runButton = document.getElementById('runCode');
  const templateButtons = document.querySelectorAll('.template-btn');

  // Tab switching
  editorTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs and panes
      editorTabs.forEach(t => t.classList.remove('active'));
      editorPanes.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Show corresponding pane
      const tabId = this.getAttribute('data-tab') + '-pane';
      const targetPane = document.getElementById(tabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Run code functionality
  if (runButton) {
    runButton.addEventListener('click', executeCode);
  }

  function executeCode() {
    const htmlCode = document.getElementById('html-code')?.value || '';
    const cssCode = document.getElementById('css-code')?.value || '';
    const jsCode = document.getElementById('js-code')?.value || '';
    const resultFrame = document.getElementById('result-frame');

    if (!resultFrame) return;

    // Create a complete HTML document with the code
    const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 20px; font-family: sans-serif; }
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        try {
            ${jsCode}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="color: red; padding: 10px; background: #fee; margin: 10px; border-radius: 4px;"><strong>Error:</strong> ' + error.message + '</div>';
        }
    <\/script>
</body>
</html>`;

    // Display result
    resultFrame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '300px';
    iframe.style.border = 'none';
    resultFrame.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(fullHTML);
    doc.close();

    // Switch to result tab
    editorTabs.forEach(t => t.classList.remove('active'));
    editorPanes.forEach(p => p.classList.remove('active'));

    const resultTab = document.querySelector('[data-tab="result"]');
    const resultPane = document.getElementById('result-pane');

    if (resultTab) resultTab.classList.add('active');
    if (resultPane) resultPane.classList.add('active');
  }

  // ==================== TEMPLATES ====================
  const templates = {
    counter: {
      name: 'Counter',
      html: `<div class="counter-app">
    <h2>Simple Counter</h2>
    <div class="counter-display" id="counter">0</div>
    <div class="counter-controls">
        <button id="decrement">-</button>
        <button id="reset">Reset</button>
        <button id="increment">+</button>
    </div>
</div>`,
      css: `.counter-app {
    text-align: center;
    padding: 2rem;
    font-family: sans-serif;
}

.counter-display {
    font-size: 3rem;
    font-weight: bold;
    color: #4361ee;
    margin: 1rem 0;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    display: inline-block;
    min-width: 100px;
}

.counter-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
}

.counter-controls button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

#decrement {
    background: #f56565;
    color: white;
}

#reset {
    background: #a0aec0;
    color: white;
}

#increment {
    background: #48bb78;
    color: white;
}

.counter-controls button:hover {
    transform: translateY(-2px);
}`,
      js: `let count = 0;
const counterDisplay = document.getElementById('counter');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');
const incrementBtn = document.getElementById('increment');

function updateCounter() {
    counterDisplay.textContent = count;
    counterDisplay.style.color = count < 0 ? '#f56565' : count > 0 ? '#48bb78' : '#4361ee';
}

decrementBtn.addEventListener('click', () => {
    count--;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
});

incrementBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

updateCounter();`,
    },
    todo: {
      name: 'Todo List',
      html: `<div class="todo-app">
    <h2>Todo List</h2>
    
    <div class="todo-input">
        <input type="text" id="todo-input" placeholder="Add a new task...">
        <button id="add-todo-btn">Add</button>
    </div>
    
    <ul class="todo-list" id="todo-list">
        <!-- Tasks will appear here -->
    </ul>
    
    <div class="todo-stats">
        <span id="total-tasks">0</span> tasks total
    </div>
</div>`,
      css: `.todo-app {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
}

.todo-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

#todo-input {
    flex: 1;
    padding: 0.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 4px;
}

#todo-input:focus {
    outline: none;
    border-color: #4361ee;
}

#add-todo-btn {
    padding: 0.5rem 1rem;
    background: #4361ee;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#add-todo-btn:hover {
    background: #3a56d4;
}

.todo-list {
    list-style: none;
    margin-bottom: 1rem;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #a0aec0;
}

.todo-checkbox {
    margin-right: 0.5rem;
    cursor: pointer;
}

.todo-text {
    flex: 1;
}

.delete-todo {
    background: none;
    border: none;
    color: #f56565;
    cursor: pointer;
    font-size: 1.2rem;
}

.todo-stats {
    text-align: center;
    color: #64748b;
    font-size: 0.9rem;
}

#total-tasks {
    font-weight: bold;
    color: #4361ee;
}`,
      js: `let todos = [];
let nextId = 1;

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const totalTasks = document.getElementById('total-tasks');

function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li style="text-align: center; color: #a0aec0; padding: 2rem;">No tasks yet. Add one above!</li>';
    } else {
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = \`todo-item \${todo.completed ? 'completed' : ''}\`;
            
            li.innerHTML = \`
                <input type="checkbox" class="todo-checkbox" \${todo.completed ? 'checked' : ''}>
                <span class="todo-text">\${todo.text}</span>
                <button class="delete-todo">×</button>
            \`;
            
            const checkbox = li.querySelector('.todo-checkbox');
            const deleteBtn = li.querySelector('.delete-todo');
            
            checkbox.addEventListener('change', () => {
                todo.completed = checkbox.checked;
                li.classList.toggle('completed', todo.completed);
                updateStats();
            });
            
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                renderTodos();
                updateStats();
            });
            
            todoList.appendChild(li);
        });
    }
    
    updateStats();
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    totalTasks.textContent = \`\${total} (\${completed} completed)\`;
}

function addTodo() {
    const text = todoInput.value.trim();
    
    if (text) {
        todos.push({
            id: nextId++,
            text: text,
            completed: false
        });
        
        todoInput.value = '';
        renderTodos();
        updateStats();
    }
}

addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initialize
renderTodos();
updateStats();`,
    },
  };

  // Template buttons
  if (templateButtons.length > 0) {
    templateButtons.forEach(button => {
      button.addEventListener('click', function () {
        const templateName = this.getAttribute('data-template');
        const template = templates[templateName];

        if (template) {
          // Update editors
          const htmlCode = document.getElementById('html-code');
          const cssCode = document.getElementById('css-code');
          const jsCode = document.getElementById('js-code');

          if (htmlCode) htmlCode.value = template.html;
          if (cssCode) cssCode.value = template.css;
          if (jsCode) jsCode.value = template.js;

          // Execute immediately
          setTimeout(executeCode, 100);

          // Visual feedback
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 200);
        }
      });
    });
  }

  // ==================== SET CURRENT YEAR ====================
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ==================== INITIAL EXECUTION ====================
  // Execute code on page load
  setTimeout(executeCode, 500);

  // ==================== ADDITIONAL ENHANCEMENTS ====================

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Auto-resize textareas
  const textareas = document.querySelectorAll('.code-editor');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    // Initial resize
    setTimeout(() => {
      textarea.style.height = textarea.scrollHeight + 'px';
    }, 100);
  });

  // Keyboard shortcut for playground
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const activePane = document.querySelector('.editor-pane.active');
      if (activePane && activePane.id !== 'result-pane') {
        executeCode();
      }
    }
  });
});
