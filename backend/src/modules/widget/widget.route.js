const express = require("express");

const router = express.Router();

router.get("/embed.js", (req, res) => {
    const accentColor = req.query.accentColor || "#3b82f6";
    const wallUrl = req.query.wallUrl || "";
    const apiUrl = process.env.API_URL || "http://localhost:4000";

    res.type("application/javascript");

    const scriptContent = `
        "use strict";
        (() => {
            const currentScript = document.currentScript;
            
            if (!currentScript) {
                console.error('Testimonial Widget: Could not locate embed script tag.');
                return;
            }

            const CONFIG = {
                widgetLimit: 9,
                apiUrl: '${apiUrl}',
                accentColor: currentScript.dataset.accentColor || '${accentColor}',
                wallUrl: currentScript.dataset.wallUrl || '${wallUrl}'
            };

            const escapeHTML = (str) => {
                if (typeof str !== 'string') return '';
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };

            const injectStyles = () => {
                if (document.getElementById('testimonial-widget-styles')) return;
                
                const style = document.createElement('style');
                style.id = 'testimonial-widget-styles';
                style.textContent = \`
                    .tw-container {
                        font-family: system-ui, -apple-system, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    .tw-loading, .tw-empty, .tw-error {
                        text-align: center;
                        padding: 2rem;
                    }
                    .tw-loading, .tw-empty {
                        color: #666;
                    }
                    .tw-empty {
                        font-style: italic;
                    }
                    .tw-error {
                        color: #ef4444;
                    }
                    .tw-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 1.5rem;
                    }
                    .tw-card {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        overflow: hidden;
                        border: 1px solid #f3f4f6;
                        display: flex;
                        flex-direction: column;
                        min-height: 200px;
                    }
                    .tw-card-content {
                        padding: 1.5rem;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .tw-stars {
                        color: \${CONFIG.accentColor};
                        font-size: 1.2rem;
                        margin-bottom: 1rem;
                    }
                    .tw-stars-empty {
                        color: #e5e5e5;
                    }
                    .tw-message {
                        color: #374151;
                        font-style: italic;
                        margin-bottom: 1.5rem;
                        flex-grow: 1;
                        line-height: 1.5;
                    }
                    .tw-author {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-top: auto;
                    }
                    .tw-avatar-img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                    .tw-avatar-placeholder {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: \${CONFIG.accentColor};
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    .tw-author-info h4 {
                        margin: 0;
                        font-weight: 600;
                        font-size: 0.875rem;
                        color: #111827;
                    }
                    .tw-author-info p {
                        font-size: 0.75rem;
                        color: #6b7280;
                        margin: 0;
                    }
                    .tw-card-border {
                        height: 4px;
                        width: 100%;
                        background-color: \${CONFIG.accentColor};
                    }
                    .tw-footer {
                        text-align: center;
                        margin-top: 1.5rem;
                    }
                    .tw-footer-link {
                        display: inline-block;
                        padding: 0.625rem 1.25rem;
                        border-radius: 0.5rem;
                        background-color: \${CONFIG.accentColor};
                        color: white;
                        font-weight: 600;
                        font-size: 0.875rem;
                        text-decoration: none;
                    }
                \`;
                document.head.appendChild(style);
            };

            const createContainer = () => {
                const container = document.createElement('div');
                container.className = 'tw-container';
                currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
                return container;
            };

            const fetchTestimonials = async () => {
                const response = await fetch(\`\${CONFIG.apiUrl}/api/testimonials/approved?take=\${CONFIG.widgetLimit}\`);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const responseData = await response.json();
                const testimonials = Array.isArray(responseData) ? responseData : responseData.data;
                const totalCount = Array.isArray(responseData) ? responseData.length : responseData.total;
                
                return { testimonials, totalCount };
            };

            const renderLoading = (container) => {
                container.innerHTML = \`<div class="tw-loading">Loading testimonials...</div>\`;
            };

            const renderEmpty = (container) => {
                container.innerHTML = \`<div class="tw-empty">No testimonials to display.</div>\`;
            };

            const renderError = (container) => {
                container.innerHTML = \`<div class="tw-error">Failed to load testimonials.</div>\`;
            };

            const createStars = (rating) => {
                const filledStars = '\\u2605'.repeat(rating);
                const emptyStars = '\\u2605'.repeat(5 - rating);
                return \`\${filledStars}<span class="tw-stars-empty">\${emptyStars}</span>\`;
            };

            const createAvatar = (testimonial) => {
                if (testimonial.photoUrl) {
                    return \`<img src="\${escapeHTML(testimonial.photoUrl)}" alt="\${escapeHTML(testimonial.name)}" class="tw-avatar-img">\`;
                }
                const initial = escapeHTML(testimonial.name.charAt(0).toUpperCase());
                return \`<div class="tw-avatar-placeholder">\${initial}</div>\`;
            };

            const createCard = (testimonial) => {
                const escapedName = escapeHTML(testimonial.name);
                const escapedCompany = escapeHTML(testimonial.company);
                const escapedMessage = escapeHTML(testimonial.message);
                const companyHtml = testimonial.company ? \`<p>\${escapedCompany}</p>\` : '';
                
                return \`
                    <div class="tw-card">
                        <div class="tw-card-content">
                            <div class="tw-stars">\${createStars(testimonial.rating)}</div>
                            <p class="tw-message">"\${escapedMessage}"</p>
                            <div class="tw-author">
                                \${createAvatar(testimonial)}
                                <div class="tw-author-info">
                                    <h4>\${escapedName}</h4>
                                    \${companyHtml}
                                </div>
                            </div>
                        </div>
                        <div class="tw-card-border"></div>
                    </div>
                \`;
            };

            const renderFooter = (totalCount) => {
                if (totalCount <= CONFIG.widgetLimit || !CONFIG.wallUrl) return '';
                
                const escapedWallUrl = escapeHTML(CONFIG.wallUrl);
                return \`
                    <div class="tw-footer">
                        <a href="\${escapedWallUrl}" target="_blank" rel="noopener noreferrer" class="tw-footer-link">
                            See all testimonials \\u2192
                        </a>
                    </div>
                \`;
            };

            const renderWidget = (container, testimonials, totalCount) => {
                const cardsHtml = testimonials.map(createCard).join('');
                
                container.innerHTML = \`
                    <div class="tw-grid">
                        \${cardsHtml}
                    </div>
                    \${renderFooter(totalCount)}
                \`;
            };

            const init = async () => {
                injectStyles();
                const container = createContainer();
                renderLoading(container);
                
                try {
                    const { testimonials, totalCount } = await fetchTestimonials();
                    
                    if (!testimonials || testimonials.length === 0) {
                        renderEmpty(container);
                    } else {
                        renderWidget(container, testimonials, totalCount);
                    }
                } catch (error) {
                    console.error('Testimonial Widget Error:', error);
                    renderError(container);
                }
            };

            init();
        })();
    `;

    res.send(scriptContent);
});

module.exports = router;
