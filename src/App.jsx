import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const ADMIN_PASSWORD = 'handsome123';

function loadSettings() {
  try {
    const saved = localStorage.getItem('shinobios-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return null;
}

const INITIAL_WINDOWS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: 'fa-user-ninja',
    isOpen: false,
    isMinimized: false,
    x: 80,
    y: 60,
    width: 500,
    height: 420,
    zIndex: 3,
    isMaximized: false,
    prevBounds: null,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: 'fa-terminal',
    isOpen: false,
    isMinimized: false,
    x: 160,
    y: 100,
    width: 600,
    height: 420,
    zIndex: 1,
    isMaximized: false,
    prevBounds: null,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: 'fa-calculator',
    isOpen: false,
    isMinimized: false,
    x: 200,
    y: 120,
    width: 280,
    height: 420,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  game: {
    id: 'game',
    title: 'Snake Game',
    icon: 'fa-gamepad',
    isOpen: false,
    isMinimized: false,
    x: 240,
    y: 80,
    width: 420,
    height: 480,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: 'fa-gear',
    isOpen: false,
    isMinimized: false,
    x: 280,
    y: 60,
    width: 520,
    height: 420,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  files: {
    id: 'files',
    title: 'File Manager',
    icon: 'fa-folder',
    isOpen: false,
    isMinimized: false,
    x: 320,
    y: 100,
    width: 550,
    height: 400,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  gallery: {
    id: 'gallery',
    title: 'Gallery',
    icon: 'fa-images',
    isOpen: false,
    isMinimized: false,
    x: 100,
    y: 90,
    width: 600,
    height: 460,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  chrome: {
    id: 'chrome',
    title: 'Chrome',
    icon: 'fa-globe',
    isOpen: false,
    isMinimized: false,
    x: 140,
    y: 70,
    width: 750,
    height: 500,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: 'fa-music',
    isOpen: false,
    isMinimized: false,
    x: 180,
    y: 110,
    width: 380,
    height: 480,
    zIndex: 0,
    isMaximized: false,
    prevBounds: null,
  }
};

const FILE_SYSTEM = {
  '/': ['Skills', 'Background', 'Certificates', 'Hobbies', 'Projects', 'Resume'],
  '/Skills': ['Frontend', 'Backend', 'Databases', 'Tools'],
  '/Skills/Frontend': ['React', 'Tailwind CSS', 'JavaScript', 'Alpine.js'],
  '/Skills/Backend': ['Laravel', 'PHP'],
  '/Skills/Databases': ['MySQL', 'SQLite', 'Supabase'],
  '/Skills/Tools': ['Vercel', 'Render', 'Canva', 'Adobe Photoshop', 'Git'],
  '/Background': ['Education', 'Experience'],
  '/Background/Education': ['Tagoloan Community College - BS Information Technology 4th Year (GWA: 1.67)'],
  '/Background/Experience': ['Team PAWIX - IT Specialist & Full-Stack Developer', 'PC Diagnostics, Network Configuration, CCTV & Biometric Setup'],
  '/Certificates': [
    { name: 'cert1.png', type: 'image', url: '/cert1.png' },
    { name: 'cert2.png', type: 'image', url: '/cert2.png' },
    { name: 'cert3.png', type: 'image', url: '/cert3.png' },
    { name: 'cert4.png', type: 'image', url: '/cert4.png' },
    { name: 'cert5.png', type: 'image', url: '/cert5.png' },
  ],
  '/Hobbies': ['Gaming', 'Coding', 'Music', 'Exploring Technology'],
  '/Projects': ['portfolio', 'mpms', 'pos-system', 'inventory-app'],
  '/Projects/portfolio': ['index.html', 'App.jsx', 'App.css', 'package.json'],
  '/Projects/mpms': ['README.md', 'index.php', 'database.sql'],
  '/Projects/pos-system': ['composer.json', 'routes.php', 'config.php'],
  '/Projects/inventory-app': ['src/', 'public/', '.env', 'package.json'],
};

const PROJECT_DETAILS = [
  { title: 'Malnutrition Profiling System (MPMS)', desc: 'System designed to monitor and manage nutritional data for community health initiatives.', tags: ['Full-Stack', 'Database', 'PHP'], url: 'https://bns-santacruz.com' },
  { title: "Librong James POS", desc: 'Point of Sale system for Car Accessories inventory management and transaction tracking.', tags: ['Laravel', 'PHP', 'Render'], url: 'https://pos-librongjames.onrender.com' },
  { title: 'Goldtown Inventory', desc: 'Robust inventory tracking application for precise stock management.', tags: ['Supabase', 'Vercel'], url: 'https://inventory-goldtown.onrender.com' },
];

function Window({ data, onInteract, onClose, onMinimize, onMaximize, children }) {
  const [position, setPosition] = useState({ x: data.x, y: data.y });
  const [size, setSize] = useState({ width: data.width, height: data.height || 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ direction: null, startX: 0, startY: 0, initialWidth: 0, initialHeight: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    if (data.isMaximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight - 32 });
      setPosition({ x: 0, y: 32 });
    } else if (data.prevBounds) {
      setSize({ width: data.prevBounds.width, height: data.prevBounds.height });
      setPosition({ x: data.prevBounds.x, y: data.prevBounds.y });
    } else {
      setSize({ width: data.width, height: data.height || 400 });
      setPosition({ x: data.x, y: data.y });
    }
  }, [data.isMaximized]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.mac-btn') || e.target.closest('.calc-btn') || e.target.tagName === 'INPUT') return;
    onInteract(data.id);
    if (data.isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX || e.touches?.[0]?.clientX || 0,
      startY: e.clientY || e.touches?.[0]?.clientY || 0,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.mac-btn') || e.target.closest('.calc-btn') || e.target.tagName === 'INPUT') return;
    onInteract(data.id);
    if (data.isMaximized) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: dragRef.current.initialX + (e.clientX - dragRef.current.startX),
        y: Math.max(32, dragRef.current.initialY + (e.clientY - dragRef.current.startY))
      });
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setPosition({
        x: dragRef.current.initialX + (touch.clientX - dragRef.current.startX),
        y: Math.max(32, dragRef.current.initialY + (touch.clientY - dragRef.current.startY))
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleResizeStart = (direction, e) => {
    e.stopPropagation();
    if (data.isMaximized) return;
    setIsResizing(true);
    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: size.width,
      initialHeight: size.height,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;
      const dir = resizeRef.current.direction;
      let newWidth = resizeRef.current.initialWidth;
      let newHeight = resizeRef.current.initialHeight;
      let newX = resizeRef.current.initialX;
      let newY = resizeRef.current.initialY;

      if (dir.includes('e')) newWidth = Math.max(300, resizeRef.current.initialWidth + deltaX);
      if (dir.includes('s')) newHeight = Math.max(200, resizeRef.current.initialHeight + deltaY);
      if (dir.includes('w')) {
        newWidth = Math.max(300, resizeRef.current.initialWidth - deltaX);
        if (newWidth > 300) newX = resizeRef.current.initialX + deltaX;
      }
      if (dir.includes('n')) {
        newHeight = Math.max(200, resizeRef.current.initialHeight - deltaY);
        if (newHeight > 200) newY = resizeRef.current.initialY + deltaY;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: Math.max(32, newY) });
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!data.isOpen || data.isMinimized) return null;

  return (
    <div
      className={`mac-window ${data.isMaximized ? 'maximized' : ''}`}
      style={{ left: position.x, top: position.y, width: size.width, height: size.height, zIndex: data.zIndex }}
      onClick={() => onInteract(data.id)}
    >
      <div className="mac-titlebar" onDoubleClick={() => onMaximize(data.id)} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        <div className="mac-controls">
          <button className="mac-btn btn-close" onClick={(e) => { e.stopPropagation(); onClose(data.id); }}><i className="fas fa-times"></i></button>
          <button className="mac-btn btn-min" onClick={(e) => { e.stopPropagation(); onMinimize(data.id); }}><i className="fas fa-minus"></i></button>
          <button className={`mac-btn btn-max ${data.isMaximized ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); onMaximize(data.id); }}><i className={`fas ${data.isMaximized ? 'fa-compress-alt' : 'fa-expand-alt'}`}></i></button>
        </div>
        <div className="window-title">{data.title}</div>
      </div>
      <div className="mac-content">{children}</div>
      {!data.isMaximized && (
        <>
          <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeStart('n', e)} />
          <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeStart('s', e)} />
          <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeStart('e', e)} />
          <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeStart('w', e)} />
          <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeStart('ne', e)} />
          <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeStart('nw', e)} />
          <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeStart('se', e)} />
          <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeStart('sw', e)} />
        </>
      )}
    </div>
  );
}

function TerminalWindow({ isDark }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'ShinobiOS Terminal v2.0.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/Home');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const resolvePath = (dir) => {
    if (dir === '~' || dir === '') return '/Home';
    if (dir.startsWith('~/')) return '/Home/' + dir.slice(2);
    if (dir.startsWith('/')) return dir;
    return currentDir === '/' ? '/' + dir : currentDir + '/' + dir;
  };

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newHistory = [...history, { type: 'input', text: trimmed, dir: currentDir }];

    switch (command) {
      case 'help':
        newHistory.push({ type: 'output', text: `Available commands:
  help              - Show this help message
  ls [dir]          - List directory contents
  cd <dir>          - Change directory
  pwd               - Print working directory
  cat <file>        - Display file contents
  echo <text>       - Print text
  clear             - Clear terminal
  date              - Show current date/time
  whoami            - Show current user
  neofetch          - Show system info
  mkdir <dir>       - Create directory
  touch <file>      - Create file
  rm <file>         - Remove file
  open <app>        - Open an app (calculator, game, settings, files, about, projects, gallery, chrome, music)
  cowsay <text>     - Cow says...
  uptime            - Show uptime
  ping <host>       - Simulate ping
  history           - Show command history
  exit              - Close terminal` });
        break;

      case 'ls': {
        const targetDir = args[0] ? resolvePath(args[0]) : currentDir;
        const files = FILE_SYSTEM[targetDir];
        if (files) {
          const displayNames = files.map(f => typeof f === 'string' ? f : f.name);
          newHistory.push({ type: 'output', text: displayNames.join('  ') });
        } else {
          newHistory.push({ type: 'error', text: `ls: ${args[0] || targetDir}: No such file or directory` });
        }
        break;
      }

      case 'cd': {
        if (!args[0] || args[0] === '~') {
          setCurrentDir('/Home');
          break;
        }
        if (args[0] === '..') {
          const parent = currentDir.split('/').slice(0, -1).join('/') || '/';
          setCurrentDir(parent === '' ? '/' : parent);
          break;
        }
        const target = resolvePath(args[0]);
        if (FILE_SYSTEM[target]) {
          setCurrentDir(target);
        } else {
          newHistory.push({ type: 'error', text: `cd: ${args[0]}: No such directory` });
        }
        break;
      }

      case 'pwd':
        newHistory.push({ type: 'output', text: currentDir });
        break;

      case 'cat': {
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'cat: missing file operand' });
        } else {
          const fileContent = {
            'resume.pdf': '[Binary file - resume.pdf]',
            'notes.txt': 'TODO: Update portfolio\n- Add snake game\n- Add terminal commands\n- Style the OS',
            'portfolio-plan.md': '# Portfolio Plan\n\n## Features\n- macOS style UI\n- Interactive terminal\n- Snake game\n- Calculator\n- Settings panel',
            '.bashrc': '# .bashrc\nexport PATH="/usr/local/bin:$PATH"\nalias ll="ls -la"\nalias cls="clear"',
            '.config': '[Configuration file]',
            'README.md': '# MPMS - Malnutrition Profiling System\n\nA system designed to monitor nutritional data.',
            'index.php': '<?php\n// Main entry point\necho "Hello World";\n?>',
            'database.sql': '-- Database schema\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255)\n);',
            'index.html': '<!DOCTYPE html>\n<html>\n<head><title>Portfolio</title></head>\n<body></body>\n</html>',
            'App.jsx': 'import React from "react";\n\nexport default function App() {\n  return <div>Hello</div>;\n}',
            'App.css': 'body { margin: 0; padding: 0; }',
            'package.json': '{\n  "name": "portfolio",\n  "version": "1.0.0"\n}',
            'composer.json': '{\n  "require": {\n    "laravel/framework": "^10.0"\n  }\n}',
            'routes.php': '<?php\nRoute::get("/", function () {\n  return view("welcome");\n});',
            'config.php': '<?php\nreturn [\n  "app" => "pos-system",\n  "debug" => true\n];',
          };
          if (fileContent[args[0]]) {
            newHistory.push({ type: 'output', text: fileContent[args[0]] });
          } else {
            newHistory.push({ type: 'error', text: `cat: ${args[0]}: No such file` });
          }
        }
        break;
      }

      case 'echo':
        newHistory.push({ type: 'output', text: args.join(' ') });
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'date':
        newHistory.push({ type: 'output', text: new Date().toString() });
        break;

      case 'whoami':
        newHistory.push({ type: 'output', text: 'ambotsaemo' });
        break;

      case 'neofetch':
        newHistory.push({ type: 'output', text: `
       .--.        ambotsaemo@portfolioos
      |o_o |       -----------------------
      |:_/ |       OS: ShinobiOS 2.0 (Canvas Edition)
     //   \\ \\      Host: MacBook Pro (Portfolio)
    (|     | )      Kernel: React 19.2.0
   /'\\_   _/\`\\     Shell: jutsu.sh
   \\___)=(___/      Resolution: ${window.innerWidth}x${window.innerHeight}
                    DE: ShinobiDE
                    CPU: Apple M2 @ 3.49GHz
                    GPU: Apple M2 Integrated
                    Memory: 8192MB / 16384MB
                    Uptime: ${Math.floor((Date.now() % 86400000) / 3600000)}h ${Math.floor((Date.now() % 3600000) / 60000)}m
                    Theme: Naruto Dark` });
        break;

      case 'mkdir':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'mkdir: missing operand' });
        } else {
          FILE_SYSTEM[currentDir] = [...(FILE_SYSTEM[currentDir] || []), args[0]];
          newHistory.push({ type: 'output', text: `Created directory: ${args[0]}` });
        }
        break;

      case 'touch':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'touch: missing operand' });
        } else {
          FILE_SYSTEM[currentDir] = [...(FILE_SYSTEM[currentDir] || []), args[0]];
          newHistory.push({ type: 'output', text: `Created file: ${args[0]}` });
        }
        break;

      case 'rm':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'rm: missing operand' });
        } else if (FILE_SYSTEM[currentDir]) {
          const idx = FILE_SYSTEM[currentDir].indexOf(args[0]);
          if (idx > -1) {
            FILE_SYSTEM[currentDir].splice(idx, 1);
            newHistory.push({ type: 'output', text: `Removed: ${args[0]}` });
          } else {
            newHistory.push({ type: 'error', text: `rm: ${args[0]}: No such file or directory` });
          }
        }
        break;

      case 'open':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'open: specify app name (calculator, game, settings, files, about, projects, gallery, chrome, music)' });
        } else {
          newHistory.push({ type: 'output', text: `Opening ${args[0]}...` });
          window.dispatchEvent(new CustomEvent('open-app', { detail: args[0].toLowerCase() }));
        }
        break;

      case 'cowsay': {
        const text = args.join(' ') || 'Moo!';
        const line = '-'.repeat(text.length + 2);
        newHistory.push({ type: 'output', text: ` ${line}\n< ${text} >\n ${line}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||` });
        break;
      }

      case 'uptime':
        newHistory.push({ type: 'output', text: ` ${new Date().toLocaleTimeString()} up ${Math.floor(Math.random() * 30) + 1} days, ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}, 1 user, load average: ${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 1.5).toFixed(2)}, ${(Math.random() * 1).toFixed(2)}` });
        break;

      case 'ping': {
        const host = args[0] || 'localhost';
        newHistory.push({ type: 'output', text: `PING ${host}: 56 data bytes\n64 bytes from ${host}: icmp_seq=0 ttl=64 time=${(Math.random() * 50 + 10).toFixed(1)} ms\n64 bytes from ${host}: icmp_seq=1 ttl=64 time=${(Math.random() * 50 + 10).toFixed(1)} ms\n64 bytes from ${host}: icmp_seq=2 ttl=64 time=${(Math.random() * 50 + 10).toFixed(1)} ms\n--- ${host} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss` });
        break;
      }

      case 'history':
        newHistory.push({ type: 'output', text: cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n') });
        break;

      case 'exit':
        window.dispatchEvent(new CustomEvent('close-app', { detail: 'terminal' }));
        return;

      default:
        newHistory.push({ type: 'error', text: `zsh: command not found: ${command}` });
    }

    setHistory(newHistory);
    setCmdHistory([...cmdHistory, trimmed]);
    setCmdIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const newIndex = cmdIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setCmdIndex(-1);
          setInput('');
        } else {
          setCmdIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.split(' ').pop();
      if (partial) {
        const allCommands = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'date', 'whoami', 'neofetch', 'mkdir', 'touch', 'rm', 'open', 'cowsay', 'uptime', 'ping', 'history', 'exit'];
        const files = [...(FILE_SYSTEM[currentDir] || []), ...allCommands];
        const match = files.find(f => f.startsWith(partial));
        if (match) {
          const parts = input.split(' ');
          parts[parts.length - 1] = match;
          setInput(parts.join(' '));
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className={`terminal-container ${isDark ? 'terminal-dark' : ''}`}>
      <div className="terminal-output" ref={terminalRef}>
        {history.map((line, i) => (
          <div key={i} className={line.type}>
            {line.type === 'input' && <span className="prompt">{line.dir}$ </span>}
            {line.text}
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="prompt">{currentDir}$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetNext, setResetNext] = useState(false);

  const handleNumber = (num) => {
    if (resetNext) {
      setDisplay(String(num));
      setResetNext(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = (a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
      case '+': return numA + numB;
      case '-': return numA - numB;
      case '×': return numA * numB;
      case '÷': return numB !== 0 ? numA / numB : 'Error';
      default: return numB;
    }
  };

  const handleOperation = (op) => {
    if (operation && !resetNext) {
      const result = calculate(previousValue, display, operation);
      setDisplay(String(result));
      setPreviousValue(String(result));
    } else {
      setPreviousValue(display);
    }
    setOperation(op);
    setResetNext(true);
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, display, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setResetNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setResetNext(false);
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
    setResetNext(true);
  };

  const handleNegate = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  return (
    <div className="calculator">
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        <button className="calc-btn func" onClick={handleClear}>AC</button>
        <button className="calc-btn func" onClick={handleNegate}>+/-</button>
        <button className="calc-btn func" onClick={handlePercent}>%</button>
        <button className="calc-btn op" onClick={() => handleOperation('÷')}>÷</button>
        <button className="calc-btn num" onClick={() => handleNumber(7)}>7</button>
        <button className="calc-btn num" onClick={() => handleNumber(8)}>8</button>
        <button className="calc-btn num" onClick={() => handleNumber(9)}>9</button>
        <button className="calc-btn op" onClick={() => handleOperation('×')}>×</button>
        <button className="calc-btn num" onClick={() => handleNumber(4)}>4</button>
        <button className="calc-btn num" onClick={() => handleNumber(5)}>5</button>
        <button className="calc-btn num" onClick={() => handleNumber(6)}>6</button>
        <button className="calc-btn op" onClick={() => handleOperation('-')}>-</button>
        <button className="calc-btn num" onClick={() => handleNumber(1)}>1</button>
        <button className="calc-btn num" onClick={() => handleNumber(2)}>2</button>
        <button className="calc-btn num" onClick={() => handleNumber(3)}>3</button>
        <button className="calc-btn op" onClick={() => handleOperation('+')}>+</button>
        <button className="calc-btn num zero" onClick={() => handleNumber(0)}>0</button>
        <button className="calc-btn num" onClick={handleDecimal}>.</button>
        <button className="calc-btn op equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

function SnakeGame({ accentColor }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('snakeHighScore') || '0'));
  const gameRef = useRef({ snake: [], food: {}, direction: 'RIGHT', nextDirection: 'RIGHT', speed: 120, interval: null });

  const GRID_SIZE = 20;
  const CELL_SIZE = 18;
  const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

  const initGame = useCallback(() => {
    const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    const food = spawnFood(snake);
    gameRef.current = { ...gameRef.current, snake, food, direction: 'RIGHT', nextDirection: 'RIGHT' };
    setScore(0);
    setGameState('playing');
  }, []);

  const spawnFood = (snake) => {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  };

  const gameLoop = useCallback(() => {
    const game = gameRef.current;
    game.direction = game.nextDirection;
    const head = { ...game.snake[0] };

    switch (game.direction) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || game.snake.some(s => s.x === head.x && s.y === head.y)) {
      clearInterval(game.interval);
      setGameState('gameover');
      const newHigh = Math.max(score, highScore);
      setHighScore(newHigh);
      localStorage.setItem('snakeHighScore', String(newHigh));
      return;
    }

    game.snake.unshift(head);
    if (head.x === game.food.x && head.y === game.food.y) {
      setScore(s => s + 10);
      game.food = spawnFood(game.snake);
      if (game.speed > 60) {
        game.speed -= 2;
        clearInterval(game.interval);
        game.interval = setInterval(gameLoop, game.speed);
      }
    } else {
      game.snake.pop();
    }

    draw();
  }, [score, highScore]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#2a2a4a';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    game.snake.forEach((segment, i) => {
      const alpha = 1 - (i / game.snake.length) * 0.5;
      ctx.fillStyle = i === 0 ? (accentColor || '#ff6600') : accentColor === '#ffffff' ? `rgba(255, 255, 255, ${alpha})` : `rgba(255, 102, 0, ${alpha})`;
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      if (i === 0) {
        ctx.fillStyle = '#000';
        const eyeSize = 3;
        if (game.direction === 'RIGHT' || game.direction === 'LEFT') {
          ctx.fillRect(segment.x * CELL_SIZE + (game.direction === 'RIGHT' ? 12 : 4), segment.y * CELL_SIZE + 4, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + (game.direction === 'RIGHT' ? 12 : 4), segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else {
          ctx.fillRect(segment.x * CELL_SIZE + 4, segment.y * CELL_SIZE + (game.direction === 'DOWN' ? 12 : 4), eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + (game.direction === 'DOWN' ? 12 : 4), eyeSize, eyeSize);
        }
      }
    });

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(game.food.x * CELL_SIZE + CELL_SIZE / 2, game.food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(game.food.x * CELL_SIZE + CELL_SIZE / 2 - 1, game.food.y * CELL_SIZE + 1, 2, 5);
  }, [accentColor]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.interval = setInterval(gameLoop, gameRef.current.speed);
    }
    return () => clearInterval(gameRef.current.interval);
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== 'playing') return;
      const game = gameRef.current;
      const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      const keyMap = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT' };
      const newDir = keyMap[e.key];
      if (newDir && newDir !== opposites[game.direction]) {
        e.preventDefault();
        game.nextDirection = newDir;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const handleTouchStart = (e) => {
    if (gameState !== 'playing') return;
    const game = gameRef.current;
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (e) => {
      e.preventDefault();
      const moveTouch = e.touches[0];
      const deltaX = moveTouch.clientX - startX;
      const deltaY = moveTouch.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const newDir = deltaX > 0 ? 'RIGHT' : 'LEFT';
        if (newDir !== opposites[game.direction]) {
          game.nextDirection = newDir;
        }
      } else {
        const newDir = deltaY > 0 ? 'DOWN' : 'UP';
        if (newDir !== opposites[game.direction]) {
          game.nextDirection = newDir;
        }
      }
    };

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="snake-game">
      <div className="snake-header">
        <span>Score: <span className="score">{score}</span></span>
        <span>High: <span className="high-score">{highScore}</span></span>
      </div>
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="snake-canvas" onTouchStart={handleTouchStart} />
      {gameState === 'idle' && (
        <div className="snake-overlay">
          <h2>Snake Game</h2>
          <p>Use arrow keys, WASD, or swipe to move</p>
          <button className="game-btn" onClick={initGame}>Start Game</button>
        </div>
      )}
      {gameState === 'gameover' && (
        <div className="snake-overlay">
          <h2>Game Over!</h2>
          <p>Score: {score}</p>
          <button className="game-btn" onClick={initGame}>Play Again</button>
        </div>
      )}
      {gameState === 'playing' && (
        <div className="snake-mobile-controls">
          <button className="snake-d-btn" onClick={() => { if (gameRef.current.direction !== 'DOWN') gameRef.current.nextDirection = 'UP'; }}><i className="fas fa-chevron-up"></i></button>
          <div className="snake-d-row">
            <button className="snake-d-btn" onClick={() => { if (gameRef.current.direction !== 'RIGHT') gameRef.current.nextDirection = 'LEFT'; }}><i className="fas fa-chevron-left"></i></button>
            <button className="snake-d-btn" onClick={() => { if (gameRef.current.direction !== 'LEFT') gameRef.current.nextDirection = 'RIGHT'; }}><i className="fas fa-chevron-right"></i></button>
          </div>
          <button className="snake-d-btn" onClick={() => { if (gameRef.current.direction !== 'UP') gameRef.current.nextDirection = 'DOWN'; }}><i className="fas fa-chevron-down"></i></button>
        </div>
      )}
    </div>
  );
}

function SettingsApp({ wallpaper, setWallpaper, isDark, setIsDark, accentColor, setAccentColor, customWallpaper, setCustomWallpaper, password, setPassword }) {
  const [pendingWallpaper, setPendingWallpaper] = useState(null);
  const [pendingSetting, setPendingSetting] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef(null);

  const wallpapers = [
    { id: 'default', name: 'Naruto Dark', gradient: 'radial-gradient(circle at 20% 30%, #2a0800 0%, #0a0a10 50%, #051020 100%)' },
    { id: 'ocean', name: 'Ocean Blue', gradient: 'radial-gradient(circle at 30% 40%, #001a33 0%, #003366 40%, #001122 100%)' },
    { id: 'forest', name: 'Forest Green', gradient: 'radial-gradient(circle at 40% 30%, #0a2a0a 0%, #1a3a1a 50%, #0a1a0a 100%)' },
    { id: 'sunset', name: 'Sunset', gradient: 'radial-gradient(circle at 50% 60%, #3a1a00 0%, #1a0a2a 50%, #0a0a1a 100%)' },
    { id: 'aurora', name: 'Aurora', gradient: 'radial-gradient(circle at 20% 50%, #002a2a 0%, #0a0a3a 40%, #1a0a2a 100%)' },
    { id: 'minimal', name: 'Minimal', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' },
  ];

  const accents = ['#ff6600', '#00d4ff', '#ff4488', '#44ff88', '#ffaa00', '#aa44ff', '#ffffff'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingWallpaper(event.target.result);
        setPendingSetting({ type: 'custom-wallpaper' });
        setShowPasswordPrompt(true);
        setInputPassword('');
        setPasswordError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const requestPasswordForSetting = (settingType) => {
    setPendingSetting(settingType);
    setShowPasswordPrompt(true);
    setInputPassword('');
    setPasswordError('');
  };

  const handleApplySetting = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      if (pendingSetting?.type === 'custom-wallpaper') {
        setCustomWallpaper(pendingWallpaper);
        setWallpaper('custom');
      } else if (pendingSetting?.type === 'wallpaper') {
        setWallpaper(pendingSetting.wallpaperId);
      }
      setShowPasswordPrompt(false);
      setPendingSetting(null);
      setPendingWallpaper(null);
    } else {
      setPasswordError('Incorrect password.');
    }
  };

  return (
    <div className="settings-app">
      <div className="settings-section">
        <h3><i className="fas fa-palette"></i> Appearance</h3>
        <div className="setting-row">
          <label>Theme</label>
          <div className="toggle-group">
            <button className={`toggle-btn ${isDark ? 'active' : ''}`} onClick={() => setIsDark(true)}>Dark</button>
            <button className={`toggle-btn ${!isDark ? 'active' : ''}`} onClick={() => setIsDark(false)}>Light</button>
          </div>
        </div>
        <div className="setting-row">
          <label>Accent Color</label>
          <div className="color-picker">
            {accents.map(color => (
              <button key={color} className={`color-swatch ${accentColor === color ? 'selected' : ''}`} style={{ background: color }} onClick={() => setAccentColor(color)} />
            ))}
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3><i className="fas fa-image"></i> Wallpaper</h3>
        <div className="wallpaper-grid">
          {wallpapers.map(wp => (
            <button key={wp.id} className={`wallpaper-option ${wallpaper === wp.id ? 'selected' : ''}`} style={{ background: wp.gradient }} onClick={() => requestPasswordForSetting({ type: 'wallpaper', wallpaperId: wp.id })}>
              <span>{wp.name}</span>
            </button>
          ))}
          {customWallpaper && (
            <button className={`wallpaper-option ${wallpaper === 'custom' ? 'selected' : ''}`} style={{ backgroundImage: `url(${customWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => requestPasswordForSetting({ type: 'wallpaper', wallpaperId: 'custom' })}>
              <span>Custom</span>
            </button>
          )}
        </div>
        <div className="upload-wallpaper-btn" onClick={() => fileInputRef.current?.click()}>
          <i className="fas fa-upload"></i>
          <span>Upload Custom Wallpaper</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>
      </div>
      <div className="settings-section">
        <h3><i className="fas fa-info-circle"></i> System Info</h3>
        <div className="system-info">
          <div className="info-row"><span>OS</span><span>ShinobiOS 2.0 Canvas Edition</span></div>
          <div className="info-row"><span>Processor</span><span>Apple M2</span></div>
          <div className="info-row"><span>Memory</span><span>16 GB</span></div>
          <div className="info-row"><span>Storage</span><span>512 GB SSD</span></div>
          <div className="info-row"><span>Display</span><span>{window.innerWidth} × {window.innerHeight}</span></div>
          <div className="info-row"><span>Browser</span><span>{navigator.userAgent.split(' ').pop()}</span></div>
        </div>
      </div>

      {showPasswordPrompt && (
        <div className="modal-overlay" onClick={() => { setShowPasswordPrompt(false); setPendingSetting(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Authentication Required</h3>
            <p>Enter admin password to apply this change:</p>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleApplySetting(); }}
              autoFocus
            />
            {passwordError && <p className="password-error">{passwordError}</p>}
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => { setShowPasswordPrompt(false); setPendingSetting(null); }}>Cancel</button>
              <button className="modal-btn apply" onClick={handleApplySetting}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FileManagerApp() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selected, setSelected] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [viewingResume, setViewingResume] = useState(false);

  const items = FILE_SYSTEM[currentPath] || [];
  const isCertificatesFolder = currentPath === '/Certificates';
  const isProjectSubfolder = currentPath.startsWith('/Projects/') && currentPath !== '/Projects';

  const navigate = (item) => {
    const itemName = typeof item === 'string' ? item : item.name;
    const newPath = currentPath === '/' ? '/' + itemName : currentPath + '/' + itemName;
    if (FILE_SYSTEM[newPath]) {
      setCurrentPath(newPath);
      setSelected(null);
    } else if (itemName === 'Resume') {
      setViewingResume(true);
    } else if (typeof item === 'object' && item.type === 'image') {
      setViewingImage(item);
    }
  };

  const goBack = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/') || '/');
    setSelected(null);
    setViewingProject(null);
  };

  const isFolder = (item) => {
    const itemName = typeof item === 'string' ? item : item.name;
    const newPath = currentPath === '/' ? '/' + itemName : currentPath + '/' + itemName;
    return FILE_SYSTEM[newPath];
  };

  const getFileIcon = (itemName, item, isFolderFlag) => {
    if (typeof item === 'object' && item.type === 'image') return 'fa-file-image folder-icon';
    if (isFolderFlag) return 'fa-folder folder-icon';
    if (itemName === 'Resume') return 'fa-file-pdf resume-icon';
    
    const ext = itemName.split('.').pop().toLowerCase();
    const iconMap = {
      'php': 'fa-file-code php-icon',
      'js': 'fa-file-code js-icon',
      'jsx': 'fa-file-code jsx-icon',
      'html': 'fa-file-code html-icon',
      'css': 'fa-file-code css-icon',
      'sql': 'fa-file-code sql-icon',
      'json': 'fa-file-code json-icon',
      'md': 'fa-file-alt md-icon',
      'env': 'fa-cog env-icon',
      'pdf': 'fa-file-pdf pdf-icon',
      'png': 'fa-file-image png-icon',
      'jpg': 'fa-file-image jpg-icon',
      'jpeg': 'fa-file-image jpeg-icon',
    };
    return iconMap[ext] || 'fa-file file-icon';
  };

  const handleProjectClick = (project) => {
    const projectData = PROJECT_DETAILS.find(p => p.title.toLowerCase().includes(project.toLowerCase()));
    if (projectData) {
      setViewingProject(projectData);
    }
  };

  return (
    <div className="file-manager">
      <div className="fm-toolbar">
        <button className="fm-nav-btn" onClick={goBack} disabled={currentPath === '/'}><i className="fas fa-arrow-left"></i></button>
        <div className="fm-path">
          {currentPath.split('/').filter(Boolean).map((part, i, arr) => (
            <React.Fragment key={part}>
              <span className="fm-path-segment" onClick={() => setCurrentPath('/' + arr.slice(0, i + 1).join('/'))}>{part}</span>
              {i < arr.length - 1 && <span className="fm-path-sep">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {viewingProject ? (
        <div className="fm-project-view">
          <button className="fm-back-to-projects" onClick={() => setViewingProject(null)}><i className="fas fa-arrow-left"></i> Back to Projects</button>
          <div className="project-card-new">
            <h3>{viewingProject.title}</h3>
            <p>{viewingProject.desc}</p>
            <div className="tags">
              {viewingProject.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            {viewingProject.url && (
              <a href={viewingProject.url} target="_blank" rel="noopener noreferrer" className="project-visit-btn">
                <i className="fab fa-chrome"></i> Visit Site
              </a>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="fm-content">
            {items.length === 0 ? (
              <div className="fm-empty">This folder is empty</div>
            ) : isCertificatesFolder ? (
              <div className="fm-gallery-view">
                {items.map((img, i) => (
                  <div key={i} className={`fm-gallery-item ${selected === img.name ? 'selected' : ''}`} onClick={() => setSelected(img.name)} onDoubleClick={() => setViewingImage(img)}>
                    <img src={img.url} alt={img.name} loading="lazy" />
                    <span className="fm-gallery-name">{img.name}</span>
                  </div>
                ))}
              </div>
            ) : isProjectSubfolder ? (
              <div className="fm-project-list">
                {PROJECT_DETAILS.map((project, i) => (
                  <div key={i} className="fm-project-item" onClick={() => handleProjectClick(project.title)}>
                    <i className="fas fa-folder-open"></i>
                    <div className="fm-project-item-info">
                      <span className="fm-project-item-name">{project.title}</span>
                      <span className="fm-project-item-desc">{project.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="fm-grid">
                {items.map(item => {
                  const itemName = typeof item === 'string' ? item : item.name;
                  const isResume = itemName === 'Resume';
                  return (
                    <div key={itemName} className={`fm-item ${selected === itemName ? 'selected' : ''}`} onClick={() => setSelected(itemName)} onDoubleClick={() => navigate(item)}>
                      <i className={`fas ${getFileIcon(itemName, item, isFolder(item))}`}></i>
                      <span className="fm-name">{itemName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="fm-status">{items.length} items</div>
        </>
      )}

      {viewingResume && (
        <div className="fm-pdf-viewer" onClick={() => setViewingResume(false)}>
          <div className="fm-pdf-viewer-content" onClick={(e) => e.stopPropagation()}>
           
            <iframe src="/olbido.pdf" title="Resume" />
          </div>
        </div>
      )}

      {viewingImage && (
        <div className="fm-image-viewer" onClick={() => setViewingImage(null)}>
          <div className="fm-image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <button className="fm-image-close" onClick={() => setViewingImage(null)}><i className="fas fa-times"></i></button>
            <img src={viewingImage.url} alt={viewingImage.name} />
            <div className="fm-image-name">{viewingImage.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTimeFromSeconds(secs) {
  const mins = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${mins}:${s.toString().padStart(2, '0')}`;
}

function GalleryApp() {
  const [images] = useState([
    { id: 1, name: 'Profile', url: '/profile.png', date: '2024-01-15', category: 'favorite' },
    { id: 2, name: 'Profile 1', url: '/profile1.png', date: '2024-02-20', category: 'favorite' },
    { id: 3, name: 'Banner', url: '/banner.png', date: '2024-03-10', category: 'hobbies' },
    { id: 4, name: 'Akatsuki', url: '/akatsuki.png', date: '2024-04-05', category: 'hobbies' },
    { id: 5, name: 'Konoha', url: '/konoha.png', date: '2024-05-18', category: 'hobbies' },
    { id: 6, name: 'POS System', url: '/pos.png', date: '2024-06-22', category: 'hobbies' },
    { id: 7, name: 'BNS', url: '/bns.png', date: '2024-07-10', category: 'hobbies' },
    { id: 8, name: 'Propesiya', url: '/propesiya.png', date: '2024-08-15', category: 'sunset' },
    { id: 9, name: 'Certificate 1', url: '/cert1.png', date: '2024-09-01', category: 'other' },
    { id: 10, name: 'Certificate 2', url: '/cert2.png', date: '2024-09-15', category: 'food' },
    { id: 11, name: 'Certificate 3', url: '/cert3.png', date: '2024-10-01', category: 'food' },
    { id: 12, name: 'Certificate 4', url: '/cert4.png', date: '2024-10-15', category: 'sunset' },
    { id: 13, name: 'Certificate 5', url: '/cert5.png', date: '2024-11-01', category: 'sunset' },
    { id: 14, name: 'My Pet', url: '/profile.png', date: '2024-12-01', category: 'pet' },
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div className="gallery-app">
      <div className="gallery-header">
        <div>
          <h3><i className="fas fa-images"></i> My Photos</h3>
          <span className="gallery-count">{filteredImages.length} photos</span>
        </div>
      </div>
      <div className="gallery-grid">
        {filteredImages.map(img => (
          <div key={img.id} className="gallery-item" onClick={() => setSelectedImage(img)}>
            <img src={img.url} alt={img.name} loading="lazy" />
            <span className="gallery-item-name">{img.name}</span>
          </div>
        ))}
      </div>
      <div className="gallery-filter-bar">
        <button className={`gallery-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} title="All Photos">
          <i className="fas fa-th"></i>
        </button>
        <button className={`gallery-filter-btn ${filter === 'favorite' ? 'active' : ''}`} onClick={() => setFilter('favorite')} title="Favorites">
          <i className="fas fa-heart"></i>
        </button>
        <button className={`gallery-filter-btn ${filter === 'pet' ? 'active' : ''}`} onClick={() => setFilter('pet')} title="My Pets">
          <i className="fas fa-paw"></i>
        </button>
        <button className={`gallery-filter-btn ${filter === 'sunset' ? 'active' : ''}`} onClick={() => setFilter('sunset')} title="Sunsets">
          <i className="fas fa-sun"></i>
        </button>
        <button className={`gallery-filter-btn ${filter === 'food' ? 'active' : ''}`} onClick={() => setFilter('food')} title="Food">
          <i className="fas fa-utensils"></i>
        </button>
        <button className={`gallery-filter-btn ${filter === 'hobbies' ? 'active' : ''}`} onClick={() => setFilter('hobbies')} title="Hobbies">
          <i className="fas fa-gamepad"></i>
        </button>
      </div>
      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={() => setSelectedImage(null)}><i className="fas fa-times"></i></button>
            <img src={selectedImage.url} alt={selectedImage.name} />
            <div className="gallery-modal-name">{selectedImage.name}</div>
            <div className="gallery-modal-date">{selectedImage.date}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChromeApp() {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [currentUrl, setCurrentUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(['https://www.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const inputRef = useRef(null);

  const navigate = (targetUrl) => {
    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      finalUrl = 'https://' + targetUrl;
    }
    setIsLoading(true);
    setUrl(finalUrl);
    setCurrentUrl(finalUrl);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleGo = () => {
    if (url.trim()) navigate(url.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGo();
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setCurrentUrl(currentUrl);
  };

  return (
    <div className="chrome-app">
      <div className="chrome-toolbar">
        <div className="chrome-nav-btns">
          <button className="chrome-nav-btn" onClick={goBack} disabled={historyIndex <= 0}><i className="fas fa-arrow-left"></i></button>
          <button className="chrome-nav-btn" onClick={goForward} disabled={historyIndex >= history.length - 1}><i className="fas fa-arrow-right"></i></button>
          <button className="chrome-nav-btn" onClick={refresh}><i className="fas fa-redo"></i></button>
        </div>
        <div className="chrome-url-bar">
          <i className="fas fa-lock"></i>
          <input ref={inputRef} type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search or enter URL..." />
        </div>
        <button className="chrome-nav-btn" onClick={handleGo}><i className="fas fa-arrow-right"></i></button>
      </div>
      <div className="chrome-content">
        {isLoading && (
          <div className="chrome-loading" onLoad={() => setIsLoading(false)}>
            <div className="chrome-loader"></div>
          </div>
        )}
        <iframe src={currentUrl} title="Browser" onLoad={() => setIsLoading(false)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
      </div>
    </div>
  );
}

function MusicPlayerApp({ accentColor }) {
  const [tracks] = useState([
    { id: 1, title: 'Remember Me', artist: 'Renz Verano', duration: '4:12', cover: '/rememberme.png', url: '/music1.mp3' },
    { id: 2, title: 'Take Me To Church', artist: 'Hozier', duration: '4:02', cover: '/hozier.jpg', url: '/Take_Me_To_Church.mp3' },
    { id: 3, title: 'The Drug In Me Is You', artist: 'Falling In Reverse', duration: '3:33', cover: '/fallinginreverse.jpg', url: '/The_Drug_In_Me_Is_You.mp3' },
    { id: 4, title: 'This Love', artist: 'Maroon 5', duration: '3:48', cover: '/maroon5.jpg', url: '/This_Love.mp3' },
    { id: 5, title: 'Thnks fr th Mmrs', artist: 'Fall Out Boy', duration: '3:32', cover: '/fall-out-boy-a23t9jwqsxhrvuxb.jpg', url: '/Thnks_fr_th_Mmrs.mp3' },
    { id: 6, title: 'Tongue Tied', artist: 'Grouplove', duration: '3:42', cover: '/grouplove.jpg', url: '/Tongue_Tied.mp3' },
    { id: 7, title: 'Toxicity', artist: 'System Of A Down', duration: '3:39', cover: '/systemofadown.jpg', url: '/Toxicity.mp3' },
    { id: 8, title: 'Welcome To The Black Parade', artist: 'My Chemical Romance', duration: '5:10', cover: '/Welcome_to_the_Black_Parade.png', url: '/Welcome_to_the_Black_Parade.mp3' },
    { id: 9, title: 'Stigmatized', artist: 'Artist', duration: '3:50', cover: '/Stigmatized.png', url: '/Stigmatized.mp3' },
  ]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('3:42');
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(tracks[currentTrack].url);
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTimeFromSeconds(audio.currentTime));
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration) {
        setTotalTime(formatTimeFromSeconds(audio.duration));
      }
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime('0:00');
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(pct);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const track = tracks[currentTrack];

  return (
    <div className="music-player">
      <div className="music-cover">
        <div className="music-cover-art"><img src={track?.cover} alt={track?.title} /></div>
      </div>
      <div className="music-info">
        <h3 className="music-title">{track?.title || 'No Track Selected'}</h3>
        <p className="music-artist">{track?.artist || 'Unknown'}</p>
      </div>
      <div className="music-progress">
        <div className="music-progress-bar" onClick={handleSeek}>
          <div className="music-progress-fill" style={{ width: `${progress}%`, background: accentColor }}></div>
        </div>
        <div className="music-time">
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
      </div>
      <div className="music-controls">
        <button className="music-ctrl-btn" onClick={handlePrev}><i className="fas fa-step-backward"></i></button>
        <button className="music-ctrl-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
        <button className="music-ctrl-btn" onClick={handleNext}><i className="fas fa-step-forward"></i></button>
      </div>
      <div className="music-volume">
        <i className="fas fa-volume-low"></i>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="music-slider" />
        <i className="fas fa-volume-high"></i>
      </div>
      <div className="music-playlist-header">
        <span>Playlist</span>
        <span className="music-track-count">{tracks.length} tracks</span>
      </div>
      <div className="music-playlist">
        {tracks.map((t, i) => (
          <div key={t.id} className={`playlist-track ${i === currentTrack ? 'active' : ''}`} onClick={() => { setCurrentTrack(i); setProgress(0); setIsPlaying(true); if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); } }}>
            <span className="playlist-track-cover"><img src={t.cover} alt={t.title} /></span>
            <div className="playlist-track-info">
              <span className="playlist-track-title">{t.title}</span>
              <span className="playlist-track-artist">{t.artist}</span>
            </div>
            <span className="playlist-track-duration">{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WifiPanel({ isOpen, onClose, wifiOn, setWifiOn }) {
  const [connected, setConnected] = useState('Konoha-Network-5G');

  const networks = [
    { name: 'Konoha-Network-5G', signal: 4, secured: true },
    { name: 'Hidden Leaf Cafe', signal: 3, secured: true },
    { name: 'Akatsuki-Lair', signal: 2, secured: true },
    { name: 'Team7-Guest', signal: 3, secured: false },
    { name: 'Hokage-Office', signal: 4, secured: true },
  ];

  if (!isOpen) return null;

  return (
    <div className="wifi-panel" onClick={(e) => e.stopPropagation()}>
      <div className="wifi-header">
        <h3><i className="fas fa-wifi"></i> Wi-Fi</h3>
        <button className="close-panel" onClick={onClose}><i className="fas fa-times"></i></button>
      </div>
      <div className="wifi-toggle-row">
        <span>Wi-Fi</span>
        <button className={`wifi-toggle ${wifiOn ? 'on' : 'off'}`} onClick={() => setWifiOn(!wifiOn)}></button>
      </div>
      {wifiOn && (
        <div className="wifi-networks">
          <p className="wifi-connected-to">Connected to: <strong>{connected}</strong></p>
          {networks.map(net => (
            <div key={net.name} className={`wifi-network ${connected === net.name ? 'active' : ''}`} onClick={() => setConnected(net.name)}>
              <div className="wifi-net-info">
                <span className="wifi-net-name">{net.name}</span>
                <span className="wifi-net-sec">{net.secured ? <i className="fas fa-lock"></i> : 'Open'}</span>
              </div>
              <div className="wifi-signal">
                {[1, 2, 3, 4].map(bar => (
                  <div key={bar} className={`signal-bar ${bar <= net.signal ? 'filled' : ''}`} />
                ))}
              </div>
              {connected === net.name && <i className="fas fa-check wifi-check"></i>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ControlCenter({ isOpen, onClose, isDark, setIsDark, wifiOn, setWifiOn, onToggleTheme }) {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(65);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(false);
  const [dnd, setDnd] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="control-center" onClick={(e) => e.stopPropagation()}>
      <div className="cc-header">
        <h3>Control Center</h3>
        <button className="close-panel" onClick={onClose}><i className="fas fa-times"></i></button>
      </div>
      <div className="cc-grid">
        <div className={`cc-card cc-wifi ${wifiOn ? 'active' : ''}`} onClick={() => setWifiOn(!wifiOn)}>
          <i className="fas fa-wifi"></i>
          <div><span>Wi-Fi</span><small>{wifiOn ? 'Connected' : 'Off'}</small></div>
        </div>
        <div className={`cc-card cc-bluetooth ${bluetooth ? 'active' : ''}`} onClick={() => setBluetooth(!bluetooth)}>
          <i className="fab fa-bluetooth"></i>
          <div><span>Bluetooth</span><small>{bluetooth ? 'On' : 'Off'}</small></div>
        </div>
        <div className={`cc-card cc-airdrop ${airdrop ? 'active' : ''}`} onClick={() => setAirdrop(!airdrop)}>
          <i className="fas fa-broadcast-tower"></i>
          <div><span>AirDrop</span><small>{airdrop ? 'On' : 'Off'}</small></div>
        </div>
        <div className={`cc-card cc-dnd ${dnd ? 'active' : ''}`} onClick={() => setDnd(!dnd)}>
          <i className="fas fa-moon"></i>
          <div><span>Focus</span><small>{dnd ? 'On' : 'Off'}</small></div>
        </div>
      </div>
      <div className="cc-slider-row">
        <i className="fas fa-sun"></i>
        <input type="range" min="0" max="100" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="cc-slider" />
        <i className="fas fa-sun sun-bright"></i>
      </div>
      <div className="cc-slider-row">
        <i className="fas fa-volume-low"></i>
        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="cc-slider" />
        <i className="fas fa-volume-high"></i>
      </div>
      <div className="cc-toggle-row">
        <span>Dark Mode</span>
        <button className={`wifi-toggle ${isDark ? 'on' : 'off'}`} onClick={onToggleTheme}></button>
      </div>
    </div>
  );
}

function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, app: 'System', title: 'Welcome to ShinobiOS', body: 'Your portfolio OS is ready to use.', time: 'Now' },
    { id: 2, app: 'Mail', title: 'New message from HR', body: 'Your application has been received.', time: '5m ago' },
    { id: 3, app: 'Calendar', title: 'Team meeting', body: 'Team PAWIX sync at 2:00 PM', time: '1h ago' },
  ]);

  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  if (!isOpen) return null;

  return (
    <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <h3>Notifications</h3>
        <button className="close-panel" onClick={onClose}><i className="fas fa-times"></i></button>
      </div>
      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className="notif-item">
            <div className="notif-content">
              <span className="notif-app">{n.app}</span>
              <span className="notif-time">{n.time}</span>
              <h4>{n.title}</h4>
              <p>{n.body}</p>
            </div>
            <button className="notif-dismiss" onClick={() => dismiss(n.id)}><i className="fas fa-times"></i></button>
          </div>
        ))}
        {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
      </div>
    </div>
  );
}

function SpotlightSearch({ isOpen, onClose, onOpenApp }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const apps = [
    { id: 'terminal', name: 'Terminal', icon: 'fa-terminal', keywords: ['command', 'shell', 'bash', 'cmd'] },
    { id: 'calculator', name: 'Calculator', icon: 'fa-calculator', keywords: ['calc', 'math', 'compute'] },
    { id: 'game', name: 'Snake Game', icon: 'fa-gamepad', keywords: ['play', 'snake', 'game', 'fun'] },
    { id: 'settings', name: 'Settings', icon: 'fa-gear', keywords: ['preferences', 'config', 'theme'] },
    { id: 'files', name: 'File Manager', icon: 'fa-folder', keywords: ['files', 'documents', 'finder', 'resume', 'skills', 'certificates'] },
    { id: 'about', name: 'About Me', icon: 'fa-user-ninja', keywords: ['profile', 'info', 'about'] },
    { id: 'gallery', name: 'Gallery', icon: 'fa-images', keywords: ['photos', 'images', 'pictures'] },
    { id: 'chrome', name: 'Chrome', icon: 'fa-globe', keywords: ['browser', 'web', 'internet', 'surf'] },
    { id: 'music', name: 'Music Player', icon: 'fa-music', keywords: ['music', 'audio', 'songs', 'player', 'mp3'] },
  ];

  const results = query
    ? apps.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.keywords.some(k => k.includes(query.toLowerCase())))
    : apps;

  if (!isOpen) return null;

  return (
    <div className="spotlight-overlay" onClick={onClose}>
      <div className="spotlight-search" onClick={(e) => e.stopPropagation()}>
        <div className="spotlight-input-wrap">
          <i className="fas fa-search"></i>
          <input ref={inputRef} type="text" placeholder="Search apps, files, commands..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} />
        </div>
        <div className="spotlight-results">
          {results.map(app => (
            <div key={app.id} className="spotlight-result" onClick={() => { onOpenApp(app.id); onClose(); }}>
              <i className={`fas ${app.icon}`}></i>
              <span>{app.name}</span>
            </div>
          ))}
          {results.length === 0 && <div className="spotlight-empty">No results for "{query}"</div>}
        </div>
      </div>
    </div>
  );
}

function CalendarWidget() {
  const [date] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = date.getDate();
  const isCurrentMonth = date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><i className="fas fa-chevron-left"></i></button>
        <span>{monthName}</span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}><i className="fas fa-chevron-right"></i></button>
      </div>
      <div className="cal-days-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {days.map((day, i) => (
          <span key={i} className={`cal-day ${day === null ? 'empty' : ''} ${isCurrentMonth && day === today ? 'today' : ''}`}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [highestZ, setHighestZ] = useState(10);
  const [time, setTime] = useState(new Date());
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingSetting, setPendingSetting] = useState(null);
  const [pendingWallpaper, setPendingWallpaper] = useState(null);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const savedSettings = loadSettings();
  const [wallpaper, setWallpaper] = useState(savedSettings?.wallpaper || 'default');
  const [customWallpaper, setCustomWallpaper] = useState(savedSettings?.customWallpaper || null);
  const [isDark, setIsDark] = useState(savedSettings?.isDark ?? true);
  const [accentColor, setAccentColor] = useState(savedSettings?.accentColor || '#ff6600');
  const [showWifi, setShowWifi] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bootScreen, setBootScreen] = useState(true);
  const [wifiOn, setWifiOn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootScreen(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOpenApp = (e) => openWindow(e.detail);
    const handleCloseApp = (e) => closeWindow(e.detail);
    window.addEventListener('open-app', handleOpenApp);
    window.addEventListener('close-app', handleCloseApp);
    return () => {
      window.removeEventListener('open-app', handleOpenApp);
      window.removeEventListener('close-app', handleCloseApp);
    };
  });

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const settings = { wallpaper, customWallpaper, isDark, accentColor };
    localStorage.setItem('shinobios-settings', JSON.stringify(settings));
  }, [wallpaper, customWallpaper, isDark, accentColor]);

  const wallpapers = {
    default: 'radial-gradient(circle at 20% 30%, #2a0800 0%, #0a0a10 50%, #051020 100%)',
    ocean: 'radial-gradient(circle at 30% 40%, #001a33 0%, #003366 40%, #001122 100%)',
    forest: 'radial-gradient(circle at 40% 30%, #0a2a0a 0%, #1a3a1a 50%, #0a1a0a 100%)',
    sunset: 'radial-gradient(circle at 50% 60%, #3a1a00 0%, #1a0a2a 50%, #0a0a1a 100%)',
    aurora: 'radial-gradient(circle at 20% 50%, #002a2a 0%, #0a0a3a 40%, #1a0a2a 100%)',
    minimal: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  };

  const getBackground = () => {
    if (wallpaper === 'custom' && customWallpaper) {
      return { backgroundImage: `url(${customWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: wallpapers[wallpaper] || wallpapers.default };
  };

  const openWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false }
    }));
    focusWindow(id);
  };

  const closeWindow = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
  };

  const minimizeWindow = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
  };

  const maximizeWindow = (id) => {
    setWindows(prev => {
      const win = prev[id];
      if (win.isMaximized) {
        return { ...prev, [id]: { ...win, isMaximized: false } };
      }
      return { ...prev, [id]: { ...win, isMaximized: true, prevBounds: { x: win.x, y: win.y, width: win.width, height: win.height } } };
    });
    focusWindow(id);
  };

  const focusWindow = (id) => {
    setHighestZ(prev => prev + 1);
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: highestZ + 1 } }));
  };

  const toggleFromDock = (id) => {
    const win = windows[id];
    if (win.isOpen && !win.isMinimized) {
      minimizeWindow(id);
    } else {
      openWindow(id);
    }
  };

  const handleSpotlightOpenApp = (id) => {
    openWindow(id);
    setShowSpotlight(false);
  };

  const desktopIcons = [
    { id: 'about', icon: 'fa-user-ninja', label: 'About Me' },
    { id: 'terminal', icon: 'fa-terminal', label: 'Terminal' },
    { id: 'files', icon: 'fa-folder', label: 'Files' },
    { id: 'gallery', icon: 'fa-images', label: 'Gallery' },
    { id: 'chrome', icon: 'fa-globe', label: 'Chrome' },
    { id: 'calculator', icon: 'fa-calculator', label: 'Calculator' },
    { id: 'game', icon: 'fa-gamepad', label: 'Snake Game' },
    { id: 'music', icon: 'fa-music', label: 'Music' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' },
  ];

  if (bootScreen) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">
          <i className="fas fa-leaf"></i>
        </div>
        <div className="boot-progress">
          <div className="boot-progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`os-wrapper ${isDark ? 'dark' : 'light'}`} style={getBackground()}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="menubar">
        <div className="menu-left">
          <span className="menu-item menu-leaf" onClick={() => setShowSpotlight(true)}><i className="fas fa-leaf"></i></span>
          <span className="menu-item menu-active">ShinobiOS</span>
          <span className="menu-item" onClick={() => openWindow('about')}>File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">View</span>
          <span className="menu-item">Go</span>
        </div>
        <div className="menu-right">
          <span className="menu-item" onClick={() => { setShowControlCenter(!showControlCenter); setShowWifi(false); setShowNotifications(false); setShowCalendar(false); }}>
            <i className="fas fa-sliders"></i>
          </span>
          <span className="menu-item" onClick={() => { setShowWifi(!showWifi); setShowControlCenter(false); setShowNotifications(false); setShowCalendar(false); }}>
            <i className={`fas fa-wifi ${wifiOn ? '' : 'wifi-off'}`}></i>
          </span>
          <span className="menu-item"><i className="fas fa-battery-three-quarters"></i></span>
          <span className="menu-item" onClick={() => { setShowNotifications(!showNotifications); setShowWifi(false); setShowControlCenter(false); setShowCalendar(false); }}>
            <i className="fas fa-bell"></i>
          </span>
          <span className="menu-item" onClick={() => { setShowCalendar(!showCalendar); setShowWifi(false); setShowControlCenter(false); setShowNotifications(false); }}>
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}&nbsp;&nbsp;
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>



      {showCalendar && (
        <div className="calendar-dropdown" onClick={(e) => e.stopPropagation()}>
          <CalendarWidget />
        </div>
      )}

      <WifiPanel isOpen={showWifi} onClose={() => setShowWifi(false)} wifiOn={wifiOn} setWifiOn={setWifiOn} />
      <ControlCenter isOpen={showControlCenter} onClose={() => setShowControlCenter(false)} isDark={isDark} setIsDark={setIsDark} wifiOn={wifiOn} setWifiOn={setWifiOn} onToggleTheme={() => setIsDark(!isDark)} />
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <SpotlightSearch isOpen={showSpotlight} onClose={() => setShowSpotlight(false)} onOpenApp={handleSpotlightOpenApp} />

      <Window data={windows.about} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <div className="about-content">
          <div className="about-avatar"><i className="fas fa-user-ninja"></i></div>
          <h2>Maximino Jr. Olbido</h2>
          <p className="about-role">Full-Stack Developer & IT Specialist</p>
          <p className="about-school">BS Information Technology — Tagoloan Community College (GWA: 1.67)</p>
          <p className="about-desc">
            Passionate IT professional with expertise in full-stack development, system administration, and network infrastructure. Currently contributing to Team PAWIX, delivering end-to-end software solutions and technical support. Proven track record in building scalable web applications, managing database systems, and deploying cloud-based services with a focus on performance and reliability.
          </p>
          <div className="about-links">
            <a href="mailto:olbidojunex@gmail.com"><i className="fas fa-envelope"></i> Email</a>
            <a href="tel:+639947587140"><i className="fas fa-phone"></i> Phone</a>
          </div>
        </div>
      </Window>

      <Window data={windows.terminal} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <TerminalWindow isDark={isDark} />
      </Window>

      <Window data={windows.calculator} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <CalculatorApp />
      </Window>

      <Window data={windows.game} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <SnakeGame accentColor={accentColor} />
      </Window>

      <Window data={windows.settings} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <SettingsApp wallpaper={wallpaper} setWallpaper={setWallpaper} isDark={isDark} setIsDark={setIsDark} accentColor={accentColor} setAccentColor={setAccentColor} customWallpaper={customWallpaper} setCustomWallpaper={setCustomWallpaper} password={inputPassword} setPassword={setInputPassword} />
      </Window>

      <Window data={windows.files} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <FileManagerApp />
      </Window>

      <Window data={windows.gallery} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <GalleryApp />
      </Window>

      <Window data={windows.chrome} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <ChromeApp />
      </Window>

      <Window data={windows.music} onInteract={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}>
        <MusicPlayerApp accentColor={accentColor} />
      </Window>

      <div className="dock-container">
        {Object.values(windows).map((win) => (
          <div
            key={win.id}
            className={`dock-item ${win.isOpen && !win.isMinimized ? 'active' : ''}`}
            onClick={() => toggleFromDock(win.id)}
          >
            <i className={`fas ${win.icon}`}></i>
            <div className="dock-tooltip">{win.title}</div>
          </div>
        ))}
        <div className="dock-separator"></div>
        <div className="dock-item" onClick={() => setShowSpotlight(true)}>
          <i className="fas fa-search"></i>
          <div className="dock-tooltip">Search</div>
        </div>
      </div>
    </div>
  );
}
