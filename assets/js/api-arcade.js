// API Arcade Game Logic
class APIArcade {
    constructor() {
        this.playerData = {
            level: 1,
            xp: 0,
            successfulRequests: 0,
            streak: 0,
            achievements: []
        };
        
        this.xpRequirements = [0, 100, 250, 500, 1000, 2000];
        this.init();
    }

    init() {
        this.loadPlayerData();
        this.updateUI();
        this.bindEvents();
        this.showMethodFields();
    }

    loadPlayerData() {
        const saved = localStorage.getItem('apiArcadeData');
        if (saved) {
            this.playerData = { ...this.playerData, ...JSON.parse(saved) };
        }
    }

    savePlayerData() {
        localStorage.setItem('apiArcadeData', JSON.stringify(this.playerData));
    }

    updateUI() {
        document.getElementById('player-level').textContent = this.playerData.level;
        document.getElementById('player-xp').textContent = this.playerData.xp;
        document.getElementById('successful-requests').textContent = this.playerData.successfulRequests;
        document.getElementById('streak').textContent = this.playerData.streak;

        // Update progress bar
        const currentLevelXP = this.xpRequirements[this.playerData.level - 1] || 0;
        const nextLevelXP = this.xpRequirements[this.playerData.level] || 2000;
        const progressXP = this.playerData.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        const progressPercent = Math.min((progressXP / requiredXP) * 100, 100);

        document.getElementById('next-level').textContent = this.playerData.level + 1;
        document.getElementById('current-xp').textContent = progressXP;
        document.getElementById('required-xp').textContent = requiredXP;
        document.getElementById('xp-progress').style.width = progressPercent + '%';

        // Update achievements
        this.updateAchievements();
    }

    updateAchievements() {
        const achievements = [
            { id: 'first-success', condition: () => this.playerData.successfulRequests >= 1 },
            { id: 'speed-demon', condition: () => this.playerData.streak >= 5 },
            { id: 'error-hunter', condition: () => this.playerData.xp >= 50 },
            { id: 'json-master', condition: () => this.playerData.successfulRequests >= 10 }
        ];

        achievements.forEach(achievement => {
            const element = document.getElementById(achievement.id);
            if (achievement.condition() && !this.playerData.achievements.includes(achievement.id)) {
                this.unlockAchievement(achievement.id, element);
            }
        });
    }

    unlockAchievement(achievementId, element) {
        this.playerData.achievements.push(achievementId);
        element.classList.remove('locked');
        element.classList.add('unlocked');
        this.showNotification(`🏅 Achievement Unlocked: ${element.querySelector('.badge-name').textContent}!`);
        this.addXP(25);
    }

    addXP(amount) {
        this.playerData.xp += amount;
        
        // Check for level up
        const newLevel = this.calculateLevel(this.playerData.xp);
        if (newLevel > this.playerData.level) {
            this.levelUp(newLevel);
        }
        
        this.savePlayerData();
        this.updateUI();
    }

    calculateLevel(xp) {
        for (let i = this.xpRequirements.length - 1; i >= 0; i--) {
            if (xp >= this.xpRequirements[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    levelUp(newLevel) {
        this.playerData.level = newLevel;
        this.showNotification(`🎉 Level Up! You're now level ${newLevel}!`);
        
        // Add celebration animation
        document.querySelector('.player-stats').classList.add('success-animation');
        setTimeout(() => {
            document.querySelector('.player-stats').classList.remove('success-animation');
        }, 600);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'arcade-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--accent-color), #4a90e2);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 8px 25px rgba(6, 92, 194, 0.3);
        `;

        document.body.appendChild(notification);

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 500);
        }, 3000);
    }

    bindEvents() {
        // Challenge buttons
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                const method = e.target.dataset.method;
                this.executeRequest(url, method);
            });
        });

        // Custom request button
        document.getElementById('launch-request').addEventListener('click', () => {
            this.executeCustomRequest();
        });

        // HTTP method change
        document.getElementById('http-method').addEventListener('change', () => {
            this.showMethodFields();
        });
    }

    showMethodFields() {
        const method = document.getElementById('http-method').value;
        const bodyGroup = document.getElementById('request-body-group');
        
        if (method === 'POST' || method === 'PUT') {
            bodyGroup.style.display = 'block';
        } else {
            bodyGroup.style.display = 'none';
        }
    }

    executeCustomRequest() {
        const url = document.getElementById('api-url').value.trim();
        const method = document.getElementById('http-method').value;
        const headers = document.getElementById('request-headers').value.trim();
        const body = document.getElementById('request-body').value.trim();

        if (!url) {
            this.showNotification('❌ Please enter an API URL!');
            return;
        }

        let parsedHeaders = {};
        if (headers) {
            try {
                parsedHeaders = JSON.parse(headers);
            } catch (e) {
                this.showNotification('❌ Invalid JSON in headers!');
                return;
            }
        }

        let parsedBody = null;
        if ((method === 'POST' || method === 'PUT') && body) {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                this.showNotification('❌ Invalid JSON in request body!');
                return;
            }
        }

        this.executeRequest(url, method, parsedHeaders, parsedBody);
    }

    async executeRequest(url, method = 'GET', headers = {}, body = null) {
        const startTime = Date.now();
        
        // Update UI to show loading
        document.getElementById('request-status').textContent = 'Launching...';
        document.getElementById('request-status').classList.add('loading');
        document.getElementById('response-placeholder').style.display = 'none';
        document.getElementById('response-data').style.display = 'block';
        document.getElementById('response-headers-content').textContent = 'Loading...';
        document.getElementById('response-body-content').textContent = 'Loading...';

        try {
            const requestOptions = {
                method: method,
                mode: 'cors', // Enable CORS
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers
                }
            };

            if (body && (method === 'POST' || method === 'PUT')) {
                requestOptions.body = JSON.stringify(body);
            }

            const response = await fetch(url, requestOptions);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Get response headers
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            // Get response body
            const contentType = response.headers.get('content-type');
            let responseBody;
            
            if (contentType && contentType.includes('application/json')) {
                responseBody = await response.json();
            } else {
                responseBody = await response.text();
            }

            // Update UI with results
            this.displayResponse(response.status, responseTime, responseHeaders, responseBody, response.ok);

            // Update game stats
            if (response.ok) {
                this.playerData.successfulRequests++;
                this.playerData.streak++;
                this.addXP(10);
                
                // Bonus XP for fast responses
                if (responseTime < 500) {
                    this.addXP(5);
                    this.showNotification('⚡ Speed bonus: +5 XP!');
                }
            } else {
                this.playerData.streak = 0;
                this.addXP(2); // Participation XP
            }

        } catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // Better error handling
            let errorMessage = 'Unknown error occurred';
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Network error - Check your internet connection or try a different API';
            } else if (error.name === 'TypeError' && error.message.includes('CORS')) {
                errorMessage = 'CORS error - This API doesn\'t allow cross-origin requests';
            } else {
                errorMessage = error.message;
            }
            
            this.displayResponse(0, responseTime, {}, { 
                error: errorMessage,
                suggestion: 'Try using httpbin.org endpoints or check if the API supports CORS'
            }, false);
            this.playerData.streak = 0;
            this.addXP(1); // Minimal XP for trying
        }

        // Update UI
        document.getElementById('request-status').textContent = 'Ready for Launch';
        document.getElementById('request-status').classList.remove('loading');
        this.savePlayerData();
        this.updateUI();
    }

    displayResponse(status, responseTime, headers, body, isSuccess) {
        // Update status badge
        const statusBadge = document.getElementById('response-status');
        statusBadge.textContent = status > 0 ? status : 'Error';
        statusBadge.className = 'status-badge ' + (isSuccess ? 'success' : 'error');

        // Update time badge
        document.getElementById('response-time').textContent = responseTime + 'ms';

        // Update headers
        document.getElementById('response-headers-content').textContent = 
            JSON.stringify(headers, null, 2);

        // Update body
        document.getElementById('response-body-content').textContent = 
            typeof body === 'object' ? JSON.stringify(body, null, 2) : body;

        // Show success animation
        if (isSuccess) {
            document.querySelector('.response-panel').classList.add('success-animation');
            setTimeout(() => {
                document.querySelector('.response-panel').classList.remove('success-animation');
            }, 600);
        }
    }
}

// Initialize the API Arcade when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('api-arcade')) {
        new APIArcade();
    }
});
