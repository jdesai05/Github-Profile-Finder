class GalacticGitHubFinder {
    constructor() {
        this.API_BASE = 'http://localhost:8000';
        this.currentRepos = [];
        this.originalRepos = [];
        this.cursorTrails = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.setupSpaceEffects();
        this.bindEvents();
        this.setupLanguageColors();
        this.checkServerConnection();
        this.setupEntranceAnimations();
    }

    setupSpaceEffects() {
        this.createCustomCursor();
        this.createFloatingParticles();
        this.createStarField();
        this.addSpaceInteractions();
    }

    createCustomCursor() {
        const cursor = document.getElementById('cursor');
        const trailCount = 8;
        
        // Create cursor trails
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.3}px;
                height: ${4 - i * 0.3}px;
                background: rgba(59, 130, 246, ${0.6 - i * 0.08});
                border-radius: 50%;
                pointer-events: none;
                z-index: ${9998 - i};
                transition: all 0.${i + 1}s ease;
            `;
            document.body.appendChild(trail);
            this.cursorTrails.push(trail);
        }

        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX - 10 + 'px';
            cursor.style.top = mouseY - 10 + 'px';
            
            // Update trails with delay
            this.cursorTrails.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = mouseX - (2 - index * 0.15) + 'px';
                    trail.style.top = mouseY - (2 - index * 0.15) + 'px';
                }, index * 50);
            });
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
            cursor.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, transparent 70%)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)';
        });
    }

    createFloatingParticles() {
        const particleCount = 80;
        const container = document.getElementById('particlesContainer');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 1;
            const colors = ['#3B82F6', '#9333EA', '#EC4899', '#06B6D4'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: particleFloat ${Math.random() * 20 + 15}s linear infinite;
                animation-delay: ${Math.random() * 20}s;
            `;
            
            particle.style.left = Math.random() * 100 + '%';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createStarField() {
        const starCount = 200;
        const stars = [];
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: fixed;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            
            document.body.appendChild(star);
            stars.push(star);
        }
    }

    addSpaceInteractions() {
        // Add hover effects to cards
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.repo-card')) {
                this.createRippleEffect(e.target.closest('.repo-card'), e);
            }
        });

        // Add parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Move particles with scroll
            this.particles.forEach((particle, index) => {
                const speed = (index % 3 + 1) * 0.1;
                particle.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Add typing animation to input
        const input = document.getElementById('username');
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(59, 130, 246, 0.1)';
        });

        input.addEventListener('blur', () => {
            input.style.boxShadow = '';
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleExpand 0.8s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const usernameInput = document.getElementById('username');
        const sortSelect = document.getElementById('sortRepos');
        const repoSearch = document.getElementById('repoSearch');
        const shareBtn = document.getElementById('shareBtn');

        searchBtn.addEventListener('click', () => this.searchProfile());
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchProfile();
            }
        });
        sortSelect.addEventListener('change', () => this.sortRepositories());
        repoSearch.addEventListener('input', (e) => this.searchRepositories(e.target.value));
        shareBtn.addEventListener('click', () => this.shareProfile());

        // Add space-themed button effects
        searchBtn.addEventListener('mouseenter', () => {
            searchBtn.style.transform = 'translateY(-3px) scale(1.05)';
        });
        searchBtn.addEventListener('mouseleave', () => {
            searchBtn.style.transform = 'translateY(0) scale(1)';
        });
    }

    async checkServerConnection() {
        const connectionStatus = document.getElementById('connectionStatus');
        const statusText = connectionStatus.querySelector('span');
        
        try {
            const response = await fetch(`${this.API_BASE}/docs`, { method: 'HEAD' });
            if (response.ok) {
                connectionStatus.className = 'connection-status connected';
                statusText.textContent = 'Hyperspace connection established';
                setTimeout(() => {
                    connectionStatus.style.opacity = '0';
                    setTimeout(() => {
                        connectionStatus.style.display = 'none';
                    }, 500);
                }, 3000);
            } else {
                throw new Error('Server not responding');
            }
        } catch (error) {
            connectionStatus.className = 'connection-status disconnected';
            statusText.textContent = 'Hyperspace connection failed';
            this.showStatusMessage('Galactic server is offline. Please activate your FastAPI stargate.', 'error');
        }
    }

    setupEntranceAnimations() {
        const elements = document.querySelectorAll('.search-section, .header-content');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            setTimeout(() => {
                el.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    async searchProfile() {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            this.showStatusMessage('Please enter a GitHub username to explore', 'error');
            return;
        }

        const includeRepos = document.getElementById('includeRepos').checked;
        
        this.showLoading();
        this.hideError();
        this.hideProfile();
        
        try {
            let data;
            if (includeRepos) {
                data = await this.fetchProfileWithRepos(username);
                this.showStatusMessage(`🚀 Galaxy scanned for @${username}`, 'success');
            } else {
                data = await this.fetchProfile(username);
                this.showStatusMessage(`🛸 Basic scan complete for @${username}`, 'success');
            }
            
            this.displayProfile(data, includeRepos);
        } catch (error) {
            this.showError(error.message);
            this.showStatusMessage(`❌ ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async fetchProfile(username) {
        const response = await fetch(`${this.API_BASE}/search/${username}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`GitHub explorer "${username}" not found in this galaxy`);
            }
            throw new Error(`Failed to scan profile: ${response.status}`);
        }
        return await response.json();
    }

    async fetchProfileWithRepos(username) {
        const response = await fetch(`${this.API_BASE}/profile/${username}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`GitHub explorer "${username}" not found in this galaxy`);
            }
            throw new Error(`Failed to scan profile: ${response.status}`);
        }
        return await response.json();
    }

    displayProfile(data, includeRepos) {
        if (includeRepos && data.profile) {
            this.displayFullProfile(data.profile);
            this.displayRepositories(data.repos);
        } else {
            this.displayBasicProfile(data);
        }
        this.showProfile();
    }

    displayBasicProfile(profile) {
        document.getElementById('avatar').src = profile.avatar_url;
        document.getElementById('name').textContent = profile.name || profile.login;
        document.getElementById('username-display').textContent = `@${profile.login}`;
        document.getElementById('bio').textContent = profile.bio || 'No bio available in this galaxy';
        document.getElementById('githubLink').href = profile.html_url;

        // Hide stats for basic profile
        document.querySelector('.profile-stats').style.display = 'none';
        
        // Show location if available
        const locationDetail = document.getElementById('locationDetail');
        if (profile.location) {
            document.getElementById('location').textContent = profile.location;
            locationDetail.style.display = 'flex';
        } else {
            locationDetail.style.display = 'none';
        }

        // Hide other details for basic profile
        document.getElementById('joinedDetail').style.display = 'none';
        document.getElementById('websiteDetail').style.display = 'none';
        document.getElementById('twitterDetail').style.display = 'none';
        document.getElementById('reposSection').style.display = 'none';
    }

    displayFullProfile(profile) {
        document.getElementById('avatar').src = profile.avatar_url;
        document.getElementById('name').textContent = profile.name || profile.login;
        document.getElementById('username-display').textContent = `@${profile.login}`;
        document.getElementById('bio').textContent = profile.bio || 'No bio available in this galaxy';
        document.getElementById('githubLink').href = profile.html_url;

        // Animate stats
        this.animateStats(profile.followers, profile.following, profile.public_repos);

        // Show stats
        document.querySelector('.profile-stats').style.display = 'flex';

        // Location
        const locationDetail = document.getElementById('locationDetail');
        if (profile.location) {
            document.getElementById('location').textContent = profile.location;
            locationDetail.style.display = 'flex';
        } else {
            locationDetail.style.display = 'none';
        }

        // Joined date
        const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('joinedDate').textContent = `Joined the galaxy ${joinedDate}`;
        document.getElementById('joinedDetail').style.display = 'flex';

        // Hide additional details (would need to be added to backend)
        document.getElementById('websiteDetail').style.display = 'none';
        document.getElementById('twitterDetail').style.display = 'none';
    }

    animateStats(followers, following, repos) {
        this.animateNumber('followers', followers);
        this.animateNumber('following', following);
        this.animateNumber('publicRepos', repos);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const duration = 1500;
        const startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);
            
            element.textContent = this.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    displayRepositories(repos) {
        const reposSection = document.getElementById('reposSection');
        const reposGrid = document.getElementById('reposGrid');
        const noRepos = document.getElementById('noRepos');
        const reposCount = document.getElementById('reposCount');
        
        if (!repos || repos.length === 0) {
            reposGrid.style.display = 'none';
            noRepos.style.display = 'block';
            reposCount.textContent = '0';
            reposSection.style.display = 'block';
            return;
        }

        reposGrid.style.display = 'grid';
        noRepos.style.display = 'none';
        reposSection.style.display = 'block';
        reposCount.textContent = repos.length;

        // Store repos for sorting and searching
        this.originalRepos = repos;
        this.currentRepos = repos;

        this.renderRepositories(repos);
    }

    renderRepositories(repos) {
        const reposGrid = document.getElementById('reposGrid');
        reposGrid.innerHTML = '';

        repos.forEach((repo, index) => {
            const repoCard = this.createRepoCard(repo);
            repoCard.style.opacity = '0';
            repoCard.style.transform = 'translateY(50px) scale(0.8)';
            reposGrid.appendChild(repoCard);

            // Staggered planet appearance animation
            setTimeout(() => {
                repoCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                repoCard.style.opacity = '1';
                repoCard.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    createRepoCard(repo) {
        const card = document.createElement('div');
        card.className = 'repo-card glow-effect';

        const languageColor = this.getLanguageColor(repo.language);
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            </div>
            <div class="repo-description">${repo.description || 'No description charted for this planet'}</div>
            <div class="repo-meta">
                <div class="repo-language">
                    ${repo.language ? `
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        <span>${repo.language}</span>
                    ` : '<span style="color: #666;">Unknown terrain</span>'}
                </div>
                <div class="repo-stats">
                    <span title="${repo.stars} stars"><i class="fas fa-star"></i> ${this.formatNumber(repo.stars)}</span>
                    <span title="${repo.forks} forks"><i class="fas fa-code-branch"></i> ${this.formatNumber(repo.forks)}</span>
                </div>
            </div>
            <div class="repo-updated">Last explored on ${updatedDate}</div>
        `;

        // Add planet wobble effect and click interaction
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                // Create orbital ring effect
                const ring = document.createElement('div');
                ring.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 200px;
                    height: 200px;
                    border: 2px solid rgba(59, 130, 246, 0.6);
                    border-radius: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    pointer-events: none;
                    animation: orbitalRing 0.6s ease-out;
                `;
                
                card.appendChild(ring);
                
                // Add orbital ring animation
                if (!document.querySelector('#orbital-ring-style')) {
                    const style = document.createElement('style');
                    style.id = 'orbital-ring-style';
                    style.textContent = `
                        @keyframes orbitalRing {
                            0% {
                                transform: translate(-50%, -50%) scale(0);
                                opacity: 1;
                            }
                            100% {
                                transform: translate(-50%, -50%) scale(2);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                setTimeout(() => {
                    ring.remove();
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        window.open(repo.html_url, '_blank');
                    }, 100);
                }, 300);
            }
        });

        return card;
    }

    sortRepositories() {
        if (!this.originalRepos || this.originalRepos.length === 0) return;

        const sortBy = document.getElementById('sortRepos').value;
        const searchTerm = document.getElementById('repoSearch').value.toLowerCase();
        
        let filteredRepos = this.originalRepos;
        
        // Apply search filter
        if (searchTerm) {
            filteredRepos = this.originalRepos.filter(repo => 
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                (repo.language && repo.language.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply sorting
        let sortedRepos = [...filteredRepos];
        switch (sortBy) {
            case 'stars':
                sortedRepos.sort((a, b) => b.stars - a.stars);
                break;
            case 'forks':
                sortedRepos.sort((a, b) => b.forks - a.forks);
                break;
            case 'name':
                sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'updated':
            default:
                sortedRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
        }

        this.currentRepos = sortedRepos;
        this.renderRepositories(sortedRepos);
        
        // Update repository count
        document.getElementById('reposCount').textContent = sortedRepos.length;
    }

    searchRepositories(searchTerm) {
        this.sortRepositories(); // This will apply both search and sort
    }

    shareProfile() {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            this.showStatusMessage('No galaxy coordinates to share', 'error');
            return;
        }

        const shareData = {
            title: `🌌 ${username}'s GitHub Galaxy`,
            text: `Explore ${username}'s code universe in the GitHub galaxy`,
            url: `https://github.com/${username}`
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showStatusMessage('🚀 Galaxy coordinates copied to clipboard!', 'success');
            }).catch(() => {
                this.showStatusMessage('❌ Unable to copy coordinates', 'error');
            });
        }
    }

    setupLanguageColors() {
        this.languageColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'TypeScript': '#2b7489',
            'C++': '#f34b7d',
            'C': '#555555',
            'C#': '#239120',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'HTML': '#e34c26',
            'CSS': '#1572B6',
            'Shell': '#89e051',
            'PowerShell': '#012456',
            'Dockerfile': '#384d54',
            'Vue': '#4FC08D',
            'React': '#61dafb',
            'Angular': '#dd0031',
            'Jupyter Notebook': '#DA5B0B',
            'R': '#276DC3',
            'Scala': '#c22d40',
            'Perl': '#0298c3',
            'Lua': '#000080',
            'default': '#3B82F6'
        };
    }

    getLanguageColor(language) {
        return this.languageColors[language] || this.languageColors['default'];
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showStatusMessage(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 4000);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        loading.style.opacity = '0';
        loading.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            loading.style.transition = 'all 0.3s ease';
            loading.style.opacity = '1';
            loading.style.transform = 'scale(1)';
        }, 100);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        loading.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                errorDiv.style.display = 'none';
                errorDiv.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    showProfile() {
        const profileContainer = document.getElementById('profileContainer');
        profileContainer.style.display = 'block';
        profileContainer.style.opacity = '0';
        profileContainer.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            profileContainer.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            profileContainer.style.opacity = '1';
            profileContainer.style.transform = 'translateY(0)';
        }, 100);
        
        // Add galactic glow effect to avatar
        setTimeout(() => {
            const avatar = document.getElementById('avatar');
            avatar.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.5)';
        }, 1000);
    }

    hideProfile() {
        document.getElementById('profileContainer').style.display = 'none';
    }
}

// Initialize the Galactic GitHub Finder
document.addEventListener('DOMContentLoaded', () => {
    new GalacticGitHubFinder();
});

// Add global space enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
    
    // Add additional CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes starTwinkle {
            0%, 100% {
                opacity: 0.3;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('username').focus();
        }
        if (e.key === 'Escape') {
            document.getElementById('username').blur();
        }
    });
});
