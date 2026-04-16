/**
 * World of Hackers Pro - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initStats();
    initUser();
    initMonitors();
    initAttackMap();
    initKernelLogs();
    initTaskbarTime();
    initNavigation();
    initSystemAlerts();
    addAdvancedVisuals();

    // Load saved theme
    const savedTheme = localStorage.getItem('woh_theme');
    if (savedTheme) setTheme(savedTheme);

    // Load CRT state
    if (localStorage.getItem('crt_disabled') === 'true') {
        document.body.classList.add('crt-disabled');
        const btn = document.getElementById('crt-toggle');
        if (btn) {
            btn.innerText = '[DISABLED]';
            btn.style.borderColor = 'var(--danger-red)';
            btn.style.color = 'var(--danger-red)';
        }
    }

    // Default view
    showSection('dashboard');
});

function addAdvancedVisuals() {
    if (!document.querySelector('.scanline')) {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
    }
}

// --- Navigation Manager ---
function initNavigation() {
    window.showSection = function(sectionId) {
        // Update Nav Items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const onclick = item.getAttribute('onclick');
            if (onclick && onclick.includes(`'${sectionId}'`)) {
                item.classList.add('active');
            }
        });

        // Update Sections
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
            // Scroll to top on mobile
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('.main-viewport');
                if (viewport) viewport.scrollTop = 0;
            }
        }

        // Re-init dashboard logic if needed
        if (sectionId === 'dashboard') {
            initStats();
            initMonitors();
            initAttackMap();
        }

        // Load settings if needed
        if (sectionId === 'settings') {
            const opInput = document.getElementById('settings-op-name');
            if (opInput) opInput.value = localStorage.getItem('hacker_name') || 'GUEST_OPERATOR';
        }

        // Notify system
        console.log(`[NAV] Switched to section: ${sectionId.toUpperCase()}`);
    };

    // Update operator name
    const opName = localStorage.getItem('hacker_name') || 'GUEST_OPERATOR';
    const opElement = document.getElementById('operator-name');
    if (opElement) opElement.textContent = opName;
}

function initTaskbarTime() {
    const timeEl = document.getElementById('taskbar-time');
    if (!timeEl) return;
    setInterval(() => {
        timeEl.textContent = new Date().toLocaleTimeString();
    }, 1000);
}

window.toggleStartMenu = function() {
    console.log("W.O.H_CORE v3.0.0 [DREAM_EDITION]");
    console.log("System Integrity: 100%");
    console.log("Active Operators: 12,400");
    showNotification('SYSTEM_STATUS', 'World of Hackers Core is fully operational.', 'success');
};

// --- Kernel Logs ---
function initKernelLogs() {
    const logContainer = document.getElementById('kernel-logs');
    if (!logContainer) return;

    const logLines = [
        "usb 1-1: new high-speed USB device number 2 using xhci_hcd",
        "eth0: link up, 1000Mbps, full-duplex, lpa 0x3C01",
        "EXT4-fs (sda1): mounted filesystem with ordered data mode",
        "systemd[1]: Started Network Time Service.",
        "audit: type=1400 audit(1618560000.123:12): avc: denied { read }",
        "IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready",
        "random: crng init done",
        "Bluetooth: Core ver 2.22",
        "NET: Registered protocol family 31",
        "W.O.H: Security protocol v3.0 initialized",
        "DREAM_ENGINE: Optimizing simulation layers..."
    ];

    setInterval(() => {
        const line = logLines[Math.floor(Math.random() * logLines.length)];
        const time = (Math.random() * 10).toFixed(6);
        logContainer.innerHTML = `[${time}] ${line}<br>` + logContainer.innerHTML.split('<br>').slice(0, 10).join('<br>');
    }, 4000);
}

// --- Settings & Themes ---
window.saveSettings = function() {
    const nameInput = document.getElementById('settings-op-name');
    if (nameInput) {
        const newName = nameInput.value.trim() || 'GUEST_OPERATOR';
        localStorage.setItem('hacker_name', newName);
        const opElement = document.getElementById('operator-name');
        if (opElement) opElement.textContent = newName;
        showNotification('SYSTEM_UPDATE', 'Operator profile updated successfully.', 'success');
    }
};

window.setTheme = function(theme) {
    document.body.classList.remove('theme-matrix', 'theme-amber', 'theme-ghost');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('woh_theme', theme);
    showNotification('INTERFACE_SYNC', `Visual theme synchronized: ${theme.toUpperCase()}`, 'info');
};

window.toggleCRT = function() {
    const isEnabled = document.body.classList.toggle('crt-disabled');
    const btn = document.getElementById('crt-toggle');
    if (btn) {
        btn.innerText = isEnabled ? '[DISABLED]' : '[ENABLED]';
        btn.style.borderColor = isEnabled ? 'var(--danger-red)' : 'var(--terminal-green)';
        btn.style.color = isEnabled ? 'var(--danger-red)' : 'var(--terminal-green)';
    }
    localStorage.setItem('crt_disabled', isEnabled);
    showNotification('SYSTEM_CONFIG', `CRT effect ${isEnabled ? 'disabled' : 'enabled'}.`, 'info');
};

// --- Notifications ---
window.showNotification = function(title, message, type = 'info') {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--terminal-green-dim); margin-bottom: 0.3rem;">[${title}]</div>
        <div style="font-size: 0.85rem; color: #fff;">${message}</div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// --- Simulated Alerts ---
function initSystemAlerts() {
    const alerts = [
        { title: "INTRUSION_DETECTED", msg: "Unauthorized access attempt on Node 142. Blocked.", type: "error" },
        { title: "NETWORK_SYNC", msg: "Global satellite link established. Latency: 42ms.", type: "success" },
        { title: "THREAT_INTEL", msg: "New zero-day exploit detected in kernel 5.14.", type: "info" },
        { title: "SYSTEM_LOAD", msg: "CPU load exceeding 80% on primary compute node.", type: "info" }
    ];

    setInterval(() => {
        if (Math.random() > 0.7) {
            const alert = alerts[Math.floor(Math.random() * alerts.length)];
            showNotification(alert.title, alert.msg, alert.type);
        }
    }, 15000);
}

// --- Attack Map ---
function initAttackMap() {
    const container = document.getElementById('pings-container');
    if (!container) return;

    setInterval(() => {
        const ping = document.createElement('div');
        ping.className = 'ping';
        ping.style.left = Math.random() * 100 + '%';
        ping.style.top = Math.random() * 100 + '%';
        container.appendChild(ping);
        setTimeout(() => ping.remove(), 2000);
    }, 800);
}

// --- System Monitors (Optimized) ---
function initMonitors() {
    const bars = {
        cpu: { bar: document.getElementById('cpu-bar'), val: document.getElementById('cpu-val') },
        ram: { bar: document.getElementById('ram-bar'), val: document.getElementById('ram-val') },
        net: { bar: document.getElementById('net-bar'), val: document.getElementById('net-val') }
    };

    if (!bars.cpu.bar) return;

    if (window.monitorInterval) clearInterval(window.monitorInterval);

    window.monitorInterval = setInterval(() => {
        const cpu = Math.floor(Math.random() * 30) + 10;
        const ram = Math.floor(Math.random() * 10) + 40;
        const net = Math.floor(Math.random() * 60) + 5;

        if (bars.cpu.bar) {
            bars.cpu.bar.style.width = cpu + '%';
            bars.cpu.bar.style.background = cpu > 80 ? 'var(--danger-red)' : 'var(--terminal-green)';
        }
        if (bars.ram.bar) bars.ram.bar.style.width = ram + '%';
        if (bars.net.bar) bars.net.bar.style.width = net + '%';

        if (bars.cpu.val) bars.cpu.val.textContent = cpu + '%';
        if (bars.ram.val) bars.ram.val.textContent = (ram / 10).toFixed(1) + ' GB';
        if (bars.net.val) bars.net.val.textContent = (net / 10).toFixed(1) + ' MB/s';

        // HEALTH
        const health = (98 + Math.random() * 2).toFixed(1);
        const healthBar = document.getElementById('health-bar');
        const healthVal = document.getElementById('health-val');
        if (healthBar) healthBar.style.width = `${health}%`;
        if (healthVal) healthVal.innerText = `${health}%`;
    }, 2000);
}

// --- Loading Screen ---
function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    // Simulate system initialization
    const texts = [
        "Initializing kernel...",
        "Loading network modules...",
        "Establishing encrypted tunnel...",
        "Bypassing firewalls...",
        "Accessing mainframe...",
        "SYSTEM READY"
    ];
    
    const loaderText = loader.querySelector('.loader-text');
    let i = 0;
    const interval = setInterval(() => {
        if (i < texts.length) {
            if (loaderText) loaderText.textContent = texts[i];
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
    }, 400);
}

// --- User Management ---
function initUser() {
    const opName = localStorage.getItem('hacker_name') || 'GUEST_OPERATOR';
    const opElement = document.getElementById('operator-name');
    if (opElement) opElement.textContent = opName;

    const opSettingsInput = document.getElementById('settings-op-name');
    if (opSettingsInput) opSettingsInput.value = opName;

    updateXPDisplay();
}

window.addXP = function(amount) {
    let xp = parseInt(localStorage.getItem('hacker_xp') || '0');
    xp += amount;
    localStorage.setItem('hacker_xp', xp);
    
    // Check for level up
    const oldLevel = Math.floor((xp - amount) / 1000);
    const newLevel = Math.floor(xp / 1000);
    
    if (newLevel > oldLevel) {
        showNotification('LEVEL_UP', `Congratulations! You have reached Level ${newLevel}.`, 'success');
    }
    
    updateXPDisplay();
    showNotification('XP_GAINED', `+${amount} XP earned.`, 'info');
};

function updateXPDisplay() {
    const xp = parseInt(localStorage.getItem('hacker_xp') || '0');
    const level = Math.floor(xp / 1000) + 1;
    const progress = (xp % 1000) / 10;
    
    const levelEl = document.getElementById('user-level');
    if (levelEl) levelEl.textContent = level.toString().padStart(2, '0');
    
    console.log(`[SYSTEM] XP: ${xp} | Level: ${level} | Progress: ${progress}%`);
}

window.startMission = function(missionName, reward) {
    showNotification('MISSION_START', `Initializing ${missionName}...`, 'info');
    showSection('terminal');
    
    // We can pass data to the iframe if needed
    const terminalIframe = document.querySelector('#section-terminal iframe');
    if (terminalIframe && terminalIframe.contentWindow) {
        terminalIframe.contentWindow.postMessage({ type: 'START_MISSION', name: missionName, reward: reward }, '*');
    }
};

// --- Matrix Effect ---
function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 33);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- Fake Stats (Optimized) ---
function initStats() {
    const stats = {
        hackers: document.getElementById('stat-hackers'),
        systems: document.getElementById('stat-systems'),
        rank: document.getElementById('stat-rank')
    };

    if (!stats.hackers) return;

    if (window.statsInterval) clearInterval(window.statsInterval);

    let hackerCount = parseInt(localStorage.getItem('global_hackers') || '12400');
    let systemsCount = parseInt(localStorage.getItem('global_systems') || '850000');
    let globalRank = parseInt(localStorage.getItem('hacker_rank_num') || '452');

    window.statsInterval = setInterval(() => {
        hackerCount += Math.floor(Math.random() * 3);
        systemsCount += Math.floor(Math.random() * 10);
        
        localStorage.setItem('global_hackers', hackerCount);
        localStorage.setItem('global_systems', systemsCount);

        if (stats.hackers) stats.hackers.textContent = hackerCount.toLocaleString();
        if (stats.systems) stats.systems.textContent = systemsCount.toLocaleString();
        if (stats.rank) stats.rank.textContent = `#${globalRank}`;
    }, 3000);
}

// --- Hacking Simulation ---
function initSimulation() {
    const terminal = document.getElementById('terminal-output');
    const input = document.getElementById('cmd-input');
    if (!terminal || !input) return;

    // Command History
    let history = JSON.parse(localStorage.getItem('hacker_history')) || [];
    let historyIndex = -1;

    // Virtual File System (VFS)
    let currentDir = '/home/kali';
    const vfs = JSON.parse(localStorage.getItem('hacker_vfs')) || {
        '/home/kali': ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Public', 'Templates', 'Videos', 'tools'],
        '/home/kali/tools': ['nmap', 'msfconsole', 'sqlmap'],
        '/home/kali/exploits': []
    };

    function saveVFS() {
        localStorage.setItem('hacker_vfs', JSON.stringify(vfs));
    }

    // Terminal Tabs
    const tabs = document.querySelectorAll('.terminal-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            terminal.innerHTML += `<p class="log-info">Switched to session: ${tab.textContent}</p>`;
            terminal.scrollTop = terminal.scrollHeight;
        });
    });

    const categories = {
        website: [
            "Targeting: https://global-bank.com",
            "Scanning for SQL injection points...",
            "Vulnerability found in /api/login",
            "Injecting payload: ' OR 1=1 --",
            "Bypassing authentication...",
            "Accessing admin dashboard...",
            "Extracting user database...",
            "Encryption key intercepted.",
            "Data exfiltration complete."
        ],
        cctv: [
            "Searching for open RTSP streams...",
            "IP range: 142.250.190.0/24",
            "Found active camera at 142.250.190.42",
            "Brute-forcing credentials...",
            "Default password 'admin' successful.",
            "Establishing video stream...",
            "Bypassing frame encryption...",
            "LIVE FEED CONNECTED: Sector 4 - Server Room",
            "Recording stream to local buffer..."
        ],
        database: [
            "Connecting to Oracle DB instance...",
            "Port 1521 open.",
            "Exploiting TNS Listener vulnerability...",
            "Remote code execution successful.",
            "Gaining system-level access...",
            "Querying sensitive tables...",
            "SELECT * FROM credit_cards WHERE limit > 10000",
            "Dumping 50,000 records...",
            "Database breach successful."
        ],
        email: [
            "Target: ceo@tech-giant.corp",
            "Phishing email delivered.",
            "Waiting for user interaction...",
            "Token intercepted from fake login page.",
            "Session hijacked.",
            "Accessing Outlook Web App...",
            "Searching for keywords: 'merger', 'acquisition', 'password'",
            "Downloading confidential attachments...",
            "Mailbox compromised."
        ],
        wifi: [
            "Interface wlan0mon set to monitor mode.",
            "Scanning for target BSSID: 00:11:22:33:44:55",
            "Capturing WPA2 handshake...",
            "Handshake captured! Saving to capture.cap",
            "Running brute-force with rockyou.txt...",
            "Attempting 10,000 passwords/sec...",
            "PASSWORD FOUND: summer2024",
            "Connecting to target network..."
        ],
        mitm: [
            "ARP spoofing initiated on 192.168.1.1 and 192.168.1.5",
            "Traffic intercepted. Routing through local proxy...",
            "SSL stripping active. Downgrading HTTPS to HTTP...",
            "Intercepting POST request to /login",
            "CREDENTIALS FOUND: admin / P@ssw0rd123",
            "Injecting malicious script into HTTP response..."
        ]
    };

    function printLine(text, type = 'info') {
        const p = document.createElement('p');
        p.className = `log-${type}`;
        
        // Typing animation effect
        let i = 0;
        const speed = 20;
        p.innerHTML = `<span class="prompt">></span> `;
        terminal.appendChild(p);
        
        const span = document.createElement('span');
        p.appendChild(span);

        function typeWriter() {
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
                terminal.scrollTop = terminal.scrollHeight;
            }
        }
        typeWriter();
    }

    // Handle Category Selection
    const catCards = document.querySelectorAll('.sim-cat-card');
    catCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.cat;
            catCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            terminal.innerHTML = '';
            runSimulation(cat);
        });
    });

    function runSimulation(cat) {
        const logs = categories[cat];
        let i = 0;
        updateVisualMonitor(cat);
        const interval = setInterval(() => {
            if (i < logs.length) {
                printLine(logs[i]);
                i++;
                updateProgressBar((i / logs.length) * 100);
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    printLine("OPERATION COMPLETE. SYSTEM SECURED.", 'success');
                    addXP(15);
                    if (cat === 'database') completeMission(3);
                    resetVisualMonitor();
                }, 1000);
            }
        }, 2000);
    }

    function updateVisualMonitor(cat) {
        const monitor = document.getElementById('visual-monitor-content');
        if (!monitor) return;

        switch(cat) {
            case 'cctv':
                monitor.innerHTML = '<div class="cctv-feed"></div><div class="monitor-overlay"></div><div style="position:absolute; top:10px; left:10px; color:red; font-size:0.8rem;">● REC</div>';
                break;
            case 'database':
                let hex = '';
                for(let i=0; i<500; i++) hex += Math.floor(Math.random()*16).toString(16) + (i%32===0?'\n':' ');
                monitor.innerHTML = `<div class="data-stream">${hex}</div>`;
                break;
            case 'website':
                monitor.innerHTML = '<div style="width:80%; height:60%; border:1px solid #333; background:#111; padding:10px; text-align:left; font-size:0.6rem;">' +
                                   '<div style="background:#222; padding:5px; margin-bottom:10px;">https://target-site.com</div>' +
                                   '<div>Loading assets...</div><div style="color:var(--terminal-green);">[VULNERABILITY_DETECTED]</div></div>';
                break;
            default:
                monitor.innerHTML = `<div class="terminal-text" style="font-size: 1.2rem;">UPLINK_ESTABLISHED<br><span style="font-size: 0.8rem; color:var(--terminal-green);">${cat.toUpperCase()}_MODE</span></div>`;
        }
    }

    function resetVisualMonitor() {
        const monitor = document.getElementById('visual-monitor-content');
        if (monitor) {
            monitor.innerHTML = '<div class="terminal-text" style="font-size: 1.5rem;">SYSTEM_IDLE<br><span style="font-size: 0.8rem; opacity: 0.5;">WAITING_FOR_UPLINK...</span></div>';
        }
    }

    function completeMission(id) {
        const mission = document.getElementById(`mission-${id}`);
        if (mission && !mission.classList.contains('completed')) {
            mission.classList.add('completed');
            addXP(50);
            printLine(`MISSION COMPLETED: +50 XP`, 'success');
        }
    }

    function updateProgressBar(percent) {
        const bar = document.querySelector('.progress-bar');
        if (bar) bar.style.width = percent + '%';
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                history.push(cmd);
                if (history.length > 50) history.shift();
                localStorage.setItem('hacker_history', JSON.stringify(history));
                historyIndex = -1;
                handleCommand(cmd.toLowerCase());
            }
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            if (history.length > 0) {
                if (historyIndex === -1) historyIndex = history.length - 1;
                else if (historyIndex > 0) historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex !== -1) {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    input.value = history[historyIndex];
                } else {
                    historyIndex = -1;
                    input.value = '';
                }
            }
        }
    });

    function handleCommand(cmd) {
        const p = document.createElement('p');
        p.className = 'log-cmd';
        p.innerHTML = `<span class="prompt" style="color: #2439fd;">kali@kali:~$</span> ${cmd}`;
        terminal.appendChild(p);
        
        const args = cmd.split(' ');
        const baseCmd = args[0];

        switch(baseCmd) {
            // --- File System (Upgraded with VFS) ---
            case 'ls':
                const files = vfs[currentDir] || [];
                if (files.length > 0) printLine(files.join('  '));
                else printLine("Directory is empty.");
                
                if (currentDir === '/home/kali' && files.includes('exploits')) {
                    completeMission(2);
                }
                break;
            case 'cd':
                if (args[1]) {
                    if (args[1] === '..') {
                        const parts = currentDir.split('/');
                        parts.pop();
                        currentDir = parts.join('/') || '/';
                        printLine(`Moved to ${currentDir}`);
                    } else {
                        const target = currentDir === '/' ? `/${args[1]}` : `${currentDir}/${args[1]}`;
                        if (vfs[target]) {
                            currentDir = target;
                            printLine(`Changed directory to ${currentDir}`);
                        } else {
                            printLine(`cd: ${args[1]}: No such file or directory`, 'error');
                        }
                    }
                } else printLine("Usage: cd <directory>");
                break;
            case 'pwd':
                printLine(currentDir);
                break;
            case 'mkdir':
                if (args[1]) {
                    const newPath = currentDir === '/' ? `/${args[1]}` : `${currentDir}/${args[1]}`;
                    if (!vfs[newPath]) {
                        vfs[newPath] = [];
                        vfs[currentDir].push(args[1]);
                        saveVFS();
                        printLine(`Directory '${args[1]}' created.`);
                        if (args[1] === 'exploits') completeMission(2);
                    } else {
                        printLine(`mkdir: cannot create directory '${args[1]}': File exists`, 'error');
                    }
                } else printLine("Usage: mkdir <name>");
                break;
            case 'touch':
                if (args[1]) {
                    if (!vfs[currentDir].includes(args[1])) {
                        vfs[currentDir].push(args[1]);
                        saveVFS();
                        printLine(`File '${args[1]}' created.`);
                    }
                } else printLine("Usage: touch <file>");
                break;
            case 'rm':
                if (args[1]) {
                    const idx = vfs[currentDir].indexOf(args[1]);
                    if (idx > -1) {
                        vfs[currentDir].splice(idx, 1);
                        saveVFS();
                        printLine(`Removed '${args[1]}'`);
                    } else {
                        printLine(`rm: cannot remove '${args[1]}': No such file or directory`, 'error');
                    }
                } else printLine("Usage: rm <file>");
                break;
            
            case 'nmap':
                printLine("Starting Nmap 7.92 ( https://nmap.org ) at 2026-04-16 01:15 UTC");
                printLine("PORT   STATE SERVICE");
                printLine("22/tcp open  ssh");
                printLine("80/tcp open  http");
                completeMission(1);
                break;

            // --- System (12 commands) ---
            case 'whoami':
                printLine("kali");
                break;
            case 'id':
                printLine("uid=1000(kali) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev),118(bluetooth),133(scanner),142(kaboxer)");
                break;
            case 'ps':
                printLine("  PID TTY          TIME CMD");
                printLine("    1 ?        00:00:01 init");
                break;
            case 'top':
                printLine("top - 01:20:05 up 1 day, 2:30, 1 user, load average: 0.05, 0.02, 0.01");
                break;
            case 'htop':
                printLine("Launching interactive process viewer...");
                break;
            case 'uptime':
                printLine(" 01:30:05 up 1 day, 2:40, 1 user, load average: 0.00, 0.01, 0.05");
                break;
            case 'df':
                printLine("Filesystem     1K-blocks    Used Available Use% Mounted on");
                printLine("/dev/sda1       51200000 8500000  42700000  17% /");
                break;
            case 'du':
                printLine("Calculating disk usage...");
                break;
            case 'free':
                printLine("              total        used        free      shared  buff/cache   available");
                printLine("Mem:        8192000     2048000     4096000      128000     2048000     6144000");
                break;
            case 'uname':
                printLine("Linux kali 5.10.0-kali7-amd64 #1 SMP Debian 5.10.28-1kali1 (2021-04-12) x86_64 GNU/Linux");
                break;
            case 'apt':
                printLine("Reading package lists... Done");
                break;
            case 'git':
                printLine("git version 2.30.2");
                break;

            // --- Security (10 commands) ---
            case 'msfconsole':
                printLine("Metasploit Framework Console v6.1.0-dev", 'success');
                printLine("msf6 > ", 'info');
                break;
            case 'aircrack-ng':
                printLine("Aircrack-ng 1.6 - (C) 2006-2020 Thomas d'Otreppe");
                break;
            case 'sqlmap':
                printLine("sqlmap {1.5.8#stable} - automatic SQL injection tool");
                break;
            case 'hydra':
                printLine("Hydra v9.1 (c) 2020 by van Hauser/THC - for legal purposes only");
                break;
            case 'john':
                printLine("John the Ripper password cracker, version 1.9.0-jumbo-1");
                break;
            case 'hashcat':
                printLine("hashcat (v6.1.1) starting...");
                break;
            case 'wireshark':
                printLine("Launching network protocol analyzer...");
                break;
            case 'tcpdump':
                printLine("Listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes");
                break;
            case 'nikto':
                printLine("- Nikto v2.1.6");
                break;
            case 'gobuster':
                printLine("Gobuster v3.1.0");
                break;

            case 'help':
                printLine("Available commands: ls, cd, pwd, mkdir, rm, cat, touch, cp, mv, find, locate, grep, awk, sed, chmod, chown, ifconfig, ip, ping, traceroute, dig, nslookup, netstat, ss, iptables, ufw, curl, wget, ssh, ftp, telnet, nmap, whoami, id, ps, top, htop, uptime, df, du, free, uname, apt, git, msfconsole, aircrack-ng, sqlmap, hydra, john, hashcat, wireshark, tcpdump, nikto, gobuster, clear, exit");
                break;
            case 'clear':
                terminal.innerHTML = '';
                break;
            case 'exit':
                window.location.href = 'index.html';
                break;
            default:
                printLine(`Command not found: ${baseCmd}. Type 'help' for list of commands.`, 'error');
        }
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// --- Tools Logic ---
function initTools() {
    // Password Strength Checker
    const passInput = document.getElementById('pass-checker-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const suggestions = document.getElementById('pass-suggestions');

    if (passInput) {
        passInput.addEventListener('input', () => {
            const val = passInput.value;
            let score = 0;
            if (!val) {
                strengthBar.className = 'strength-bar';
                strengthText.textContent = 'Strength: -';
                return;
            }

            if (val.length > 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            if (score <= 1) {
                strengthBar.className = 'strength-bar strength-weak';
                strengthText.textContent = 'Strength: Weak';
                suggestions.textContent = 'Suggestion: Use longer password with symbols.';
            } else if (score <= 3) {
                strengthBar.className = 'strength-bar strength-medium';
                strengthText.textContent = 'Strength: Medium';
                suggestions.textContent = 'Suggestion: Add more special characters.';
            } else {
                strengthBar.className = 'strength-bar strength-strong';
                strengthText.textContent = 'Strength: Strong';
                suggestions.textContent = 'Excellent password.';
            }
        });
    }

    // Password Generator
    const genBtn = document.getElementById('gen-pass-btn');
    const genOutput = document.getElementById('gen-pass-output');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
            let pass = "";
            for (let i = 0; i < 16; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            genOutput.textContent = pass;
        });
    }

    // Base64 Encoder/Decoder
    const b64Input = document.getElementById('b64-input');
    const b64Encode = document.getElementById('b64-encode');
    const b64Decode = document.getElementById('b64-decode');
    const b64Output = document.getElementById('b64-output');

    if (b64Encode) {
        b64Encode.addEventListener('click', () => {
            try {
                b64Output.textContent = btoa(b64Input.value);
            } catch(e) { b64Output.textContent = "Error encoding."; }
        });
    }
    if (b64Decode) {
        b64Decode.addEventListener('click', () => {
            try {
                b64Output.textContent = atob(b64Input.value);
            } catch(e) { b64Output.textContent = "Error decoding."; }
        });
    }

    // Hash Generator
    const hashInput = document.getElementById('hash-input');
    const hashBtn = document.getElementById('hash-gen-btn');
    const hashOutput = document.getElementById('hash-output');
    if (hashBtn) {
        hashBtn.addEventListener('click', () => {
            const val = hashInput.value;
            if (!val) return;
            // Simulated hashing for demo
            const md5 = "81dc9bdb52d04dc20036dbd8313ed055";
            const sha256 = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";
            hashOutput.innerHTML = `MD5: ${md5}<br>SHA-256: ${sha256}`;
        });
    }

    // Payload Generator
    const payloadType = document.getElementById('payload-type');
    const payloadBtn = document.getElementById('payload-gen-btn');
    const payloadOutput = document.getElementById('payload-output');
    if (payloadBtn) {
        payloadBtn.addEventListener('click', () => {
            const type = payloadType.value;
            const payloads = {
                xss: "<script>alert('XSS')</script>",
                sqli: "' OR 1=1 --",
                rce: "; cat /etc/passwd"
            };
            payloadOutput.textContent = payloads[type] || "Select type";
        });
    }
}

// --- News System ---
function initNews() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;

    const newsArticles = [
        { title: "Major Data Breach in Global Finance Corp", date: "2 hours ago", content: "Over 5 million user records leaked on dark web forums." },
        { title: "New Zero-Day Vulnerability Found in Popular Browser", date: "5 hours ago", content: "Security researchers warn of active exploitation in the wild." },
        { title: "Hackers Target Critical Infrastructure in Cyber Warfare", date: "1 day ago", content: "State-sponsored groups suspected in recent power grid anomalies." },
        { title: "Phishing Campaign Spreading via Professional Networks", date: "3 hours ago", content: "Attackers using fake job offers to steal corporate credentials." },
        { title: "Cryptocurrency Exchange Loses $50M in Hot Wallet Hack", date: "8 hours ago", content: "Users advised to move funds to cold storage immediately." },
        { title: "AI-Powered Malware Bypassing Traditional Antivirus", date: "12 hours ago", content: "Next-gen threats use machine learning to adapt to security measures." }
    ];

    // Shuffle and pick 3
    const shuffled = newsArticles.sort(() => 0.5 - Math.random()).slice(0, 3);

    newsList.innerHTML = shuffled.map(news => `
        <div class="news-card card">
            <div class="news-date">${news.date}</div>
            <h3>${news.title}</h3>
            <p>${news.content}</p>
        </div>
    `).join('');
}

// --- Roadmap Logic ---
function initRoadmap() {
    const steps = document.querySelectorAll('.roadmap-step');
    if (steps.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    steps.forEach(step => observer.observe(step));
}

// --- Leaderboard ---
function initLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    const topHackers = [
        { name: 'ShadowRoot', xp: 2500 },
        { name: 'NullByte', xp: 2100 },
        { name: 'CyberGhost', xp: 1850 },
        { name: 'PhantomX', xp: 1600 },
        { name: 'ZeroDay', xp: 1420 }
    ];

    const userXP = parseInt(localStorage.getItem('hacker_xp') || '0');
    topHackers.push({ name: (localStorage.getItem('hacker_name') || 'Guest') + " (You)", xp: userXP });

    topHackers.sort((a, b) => b.xp - a.xp);

    list.innerHTML = topHackers.map((h, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${h.name}</td>
            <td>${h.xp} XP</td>
            <td>${getRankFromXP(h.xp)}</td>
        </tr>
    `).join('');
}

// --- Helpers ---
function addXP(amount) {
    let xp = parseInt(localStorage.getItem('hacker_xp') || '0');
    xp += amount;
    localStorage.setItem('hacker_xp', xp.toString());
    
    const rank = getRankFromXP(xp);
    localStorage.setItem('hacker_rank', rank);
    initUser(); // Refresh UI
}

function getRankFromXP(xp) {
    if (xp > 1000) return 'Shadow Hacker';
    if (xp > 500) return 'Elite';
    if (xp > 100) return 'Operator';
    return 'Rookie';
}
