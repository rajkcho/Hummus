/**
 * Social Sharing Component for EVCalc.io
 * Generates shareable content from calculator results
 */

(function() {
    'use strict';
    
    const EVShare = {
        // Generate share text from calculator results
        generateShareText: function(calculatorType, savings) {
            const templates = {
                roi: `I'd save $${Math.round(savings)} per year by charging my EV at home! 🔌⚡`,
                tco: `An EV would save me $${Math.round(savings)} over 5 years compared to gas! 🚗💰`,
                quick: `Switching to an EV could save me $${Math.round(savings)}/year on fuel! ⚡🌱`
            };
            
            const text = templates[calculatorType] || templates.quick;
            const url = 'https://evcalc.io';
            const hashtags = 'EV,ElectricVehicle,CleanEnergy';
            
            return { text, url, hashtags };
        },
        
        // Twitter/X share
        shareTwitter: function(calculatorType, savings) {
            const { text, url, hashtags } = this.generateShareText(calculatorType, savings);
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' Calculate yours:')}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
            window.open(twitterUrl, '_blank', 'width=550,height=420');
            this.trackShare('twitter', calculatorType);
        },
        
        // Facebook share
        shareFacebook: function(calculatorType, savings) {
            const { url } = this.generateShareText(calculatorType, savings);
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(facebookUrl, '_blank', 'width=550,height=420');
            this.trackShare('facebook', calculatorType);
        },
        
        // LinkedIn share
        shareLinkedIn: function(calculatorType, savings) {
            const { text, url } = this.generateShareText(calculatorType, savings);
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            window.open(linkedinUrl, '_blank', 'width=550,height=420');
            this.trackShare('linkedin', calculatorType);
        },
        
        // Copy link to clipboard
        copyLink: function(calculatorType) {
            const url = 'https://evcalc.io';
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Link copied to clipboard! 📋');
                this.trackShare('copy', calculatorType);
            }).catch(() => {
                // Fallback for older browsers
                const input = document.createElement('input');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                this.showToast('Link copied! 📋');
            });
        },
        
        // Show toast notification
        showToast: function(message) {
            const existing = document.getElementById('ev-toast');
            if (existing) existing.remove();
            
            const toast = document.createElement('div');
            toast.id = 'ev-toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                font-weight: 600;
                z-index: 10000;
                animation: slideInUp 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },
        
        // Track shares (privacy-friendly localStorage analytics)
        trackShare: function(platform, calculatorType) {
            try {
                const key = 'evcalc_shares';
                const shares = JSON.parse(localStorage.getItem(key) || '[]');
                shares.push({
                    platform,
                    calculator: calculatorType,
                    timestamp: new Date().toISOString()
                });
                // Keep last 100 shares
                if (shares.length > 100) shares.shift();
                localStorage.setItem(key, JSON.stringify(shares));
            } catch(e) {
                // Silent fail if localStorage unavailable
            }
        },
        
        // Add share buttons to calculator results
        addShareButtons: function(containerSelector, calculatorType, savings) {
            const container = document.querySelector(containerSelector);
            if (!container) return;
            
            const existing = container.querySelector('.ev-share-buttons');
            if (existing) existing.remove();
            
            const shareDiv = document.createElement('div');
            shareDiv.className = 'ev-share-buttons';
            shareDiv.style.cssText = `
                display: flex;
                gap: 0.75rem;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
                flex-wrap: wrap;
            `;
            
            const title = document.createElement('p');
            title.textContent = '📢 Share Your Savings:';
            title.style.cssText = 'width: 100%; margin: 0 0 0.5rem; font-weight: 600; color: #64748b; font-size: 0.9rem;';
            shareDiv.appendChild(title);
            
            const buttons = [
                { icon: '𝕏', label: 'Share on X', action: () => this.shareTwitter(calculatorType, savings), color: '#000' },
                { icon: 'f', label: 'Share on Facebook', action: () => this.shareFacebook(calculatorType, savings), color: '#1877f2' },
                { icon: 'in', label: 'Share on LinkedIn', action: () => this.shareLinkedIn(calculatorType, savings), color: '#0a66c2' },
                { icon: '🔗', label: 'Copy Link', action: () => this.copyLink(calculatorType), color: '#6b7280' }
            ];
            
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.innerHTML = `<span style="font-weight: 700;">${btn.icon}</span> ${btn.label}`;
                button.className = 'ev-share-btn';
                button.style.cssText = `
                    background: ${btn.color};
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                `;
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = 'none';
                });
                button.addEventListener('click', btn.action);
                shareDiv.appendChild(button);
            });
            
            container.appendChild(shareDiv);
        },
        
        // Get share analytics from localStorage
        getAnalytics: function() {
            try {
                const shares = JSON.parse(localStorage.getItem('evcalc_shares') || '[]');
                const byPlatform = shares.reduce((acc, s) => {
                    acc[s.platform] = (acc[s.platform] || 0) + 1;
                    return acc;
                }, {});
                const byCalculator = shares.reduce((acc, s) => {
                    acc[s.calculator] = (acc[s.calculator] || 0) + 1;
                    return acc;
                }, {});
                return { total: shares.length, byPlatform, byCalculator, recent: shares.slice(-10) };
            } catch(e) {
                return null;
            }
        }
    };
    
    // Add CSS animations
    if (!document.getElementById('ev-share-animations')) {
        const style = document.createElement('style');
        style.id = 'ev-share-animations';
        style.textContent = `
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Export to global scope
    window.EVShare = EVShare;
    
})();

// Usage example:
// After calculator completes, call:
// EVShare.addShareButtons('#roi-results', 'roi', 1200);
