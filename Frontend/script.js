class GalacticGitHubFinder {
    constructor() {
        this.API_BASE = 'http://localhost:8000';
        this.currentRepos = [];
        this.originalRepos = [];
        this.init();
    }

    init() {
        this.setupOptimizedEffects();
        this.bindEvents();
        this.setupLanguageColors();
        this.checkServerConnection();
        this.setupEntranceAnimations();
    }

    setupOptimizedEffects() {
        this.createSimpleCursor();
        this.createMinimalParticles();
        this.addBasicInteractions();
    }

    createSimpleCursor() {
        const cursor = document.getElementById('cursor');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    }

    createMinimalParticles() {
        // Reduced particle count for better performance
        const particleCount = 15;
        const container = document.getElementById('particlesContainer');
        
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'particlesContainer';
            newContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
            `;
            document.body.appendChild(newContainer);
        }
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const colors = ['#3B82F6', '#9333EA'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                opacity: ${Math.random() * 0.6 + 0.2};
                animation: simpleFloat ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
                left: ${Math.random() * 100}%;
                top: 100%;
            `;
            
            container.appendChild(particle);
        }
        
        // Add simplified float animation
        if (!document.querySelector('#simple-float-style')) {
            const style = document.createElement('style');
            style.id = 'simple-float-style';
            style.textContent = `
                @keyframes simpleFloat {
                    0% {
                        transform: translateY(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addBasicInteractions() {
        // Simplified parallax effect
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const header = document.querySelector('.header');
                    if (header) {
                        header.style.transform = `translateY(${scrolled * 0.2}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Add simple hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.repo-card')) {
                const card = e.target.closest('.repo-card');
                card.style.transform = 'scale(1.05)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.repo-card')) {
                const card = e.target.closest('.repo-card');
                card.style.transform = 'scale(1)';
            }
        });
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
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
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

        // Hide additional details
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
        const duration = 1000;
        const startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            
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
            repoCard.style.transform = 'translateY(30px)';
            reposGrid.appendChild(repoCard);

            // Staggered animation with reduced delay
            setTimeout(() => {
                repoCard.style.transition = 'all 0.5s ease';
                repoCard.style.opacity = '1';
                repoCard.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    createRepoCard(repo) {
        const card = document.createElement('div');
        card.className = 'repo-card';

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

        // Simple click effect
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.open(repo.html_url, '_blank');
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
        this.sortRepositories();
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
        }, 3000);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        loading.style.opacity = '0';
        
        setTimeout(() => {
            loading.style.transition = 'opacity 0.3s ease';
            loading.style.opacity = '1';
        }, 10);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        
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
        }, 4000);
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    showProfile() {
        const profileContainer = document.getElementById('profileContainer');
        profileContainer.style.display = 'block';
        profileContainer.style.opacity = '0';
        profileContainer.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            profileContainer.style.transition = 'all 0.6s ease';
            profileContainer.style.opacity = '1';
            profileContainer.style.transform = 'translateY(0)';
        }, 50);
    }

    hideProfile() {
        document.getElementById('profileContainer').style.display = 'none';
    }
}

// Initialize the optimized Galactic GitHub Finder
document.addEventListener('DOMContentLoaded', () => {
    new GalacticGitHubFinder();
});

// Add minimal global enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
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
    
    // Add focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
});
