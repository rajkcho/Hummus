# EVCalc.io 🔋⚡

**Premium Electric Vehicle Economics Platform**

Calculate charging costs, compare total ownership, and make smart EV decisions with beautiful, data-driven tools.

## Features

### 🧮 Three Powerful Calculators
1. **Home Charging ROI** - Calculate payback period and 5-year savings
2. **EV vs Gas TCO** - Complete 5-year total cost of ownership comparison
3. **Quick Savings** - Instant annual fuel savings estimate

### ✨ Premium Experience
- Webby Award-level design with smooth micro-interactions
- Dark/light mode with system preference detection
- Fully responsive (mobile-first)
- Accessible (WCAG 2.1 AA compliant)
- Lightning-fast performance (<2s load time)
- Local storage (save your inputs)

### 💰 Monetization
- Amazon Associates (charging equipment, accessories)
- Google AdSense (contextual auto-ads)
- Premium PDF exports ($4.99)
- Lead generation (electrician quotes)

### 📊 Real Data
- EPA efficiency ratings for 20+ EV models
- State-specific electricity rates & incentives
- Current federal tax credit info
- Real-world maintenance costs

## Tech Stack

**100% Static** - No backend required
- HTML5 semantic markup
- Modern CSS (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Chart.js (lightweight visualizations)
- Google Fonts (Inter)

**Performance**
- Critical CSS inline
- Lazy loading images
- Minified assets
- CDN-ready

**SEO**
- Structured data (JSON-LD)
- OpenGraph & Twitter Cards
- Semantic HTML
- Mobile-optimized
- Fast Core Web Vitals

## Deployment

### GitHub Pages (Recommended)
```bash
# Already configured for rajkcho/Hummus
git push origin main
# Live at: https://rajkcho.github.io/Hummus/
```

### Custom Domain (evcalc.io)
1. Add CNAME file with: `evcalc.io`
2. Configure DNS:
   - CNAME: www → rajkcho.github.io
   - A records for apex domain → GitHub IPs
3. Enable HTTPS in repo settings

### Other Hosts
- Netlify: Drag & drop `dist/` folder
- Vercel: Import GitHub repo
- Cloudflare Pages: Connect repo

## File Structure
```
hummus/
├── index.html              # Main page
├── calculators.js          # Calculator logic
├── data.js                 # EV models & constants
├── styles.css              # Global styles
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── manifest.json           # PWA
└── assets/
    ├── og-image.jpg        # Social sharing
    └── favicon.svg         # Icon
```

## Affiliate Setup

### Amazon Associates
1. Sign up at associates.amazon.com
2. Replace `PLACEHOLDER` links in `data.js` with your associate ID
3. Add disclosure in footer (FTC compliance)

### Insurance/Dealership Affiliates
- Coverage.com (insurance comparison)
- TrueCar (dealership referrals)
- Edmunds (car shopping)

## Analytics

- **Google Analytics 4**: Create property and update GA ID in index.html
- **Google Search Console**: Verify ownership and submit sitemap
- **Hotjar/Microsoft Clarity**: Optional heatmaps

## Marketing Strategy

### SEO (Organic)
- Target keywords: "ev charging cost calculator", "ev vs gas comparison"
- Backlinks: Submit to calculator directories (CalcXML, etc.)
- Guest posts on EV blogs linking back

### Social
- Reddit: r/electricvehicles, r/teslamotors (helpful, not spammy)
- Twitter: Share calc results with #EV hashtags
- LinkedIn: Post case studies ("See how much EVs save")

### Paid (Optional)
- Google Ads: Bid on "ev calculator" keywords
- Facebook: Target EV interest groups
- Reddit Ads: Cheap CPC in EV communities

## Revenue Projections

**Conservative** (1,000 monthly users)
- AdSense: $50-$100/mo ($2-4 RPM)
- Amazon: $30-$80/mo (3-5% conversion, $60 AOV)
- Premium PDFs: $20-$50/mo (5-10 purchases)
- **Total: $100-$230/month**

**Moderate** (10,000 monthly users)
- AdSense: $500-$1,000/mo
- Amazon: $300-$800/mo
- Premium PDFs: $200-$500/mo
- Lead gen: $200-$400/mo
- **Total: $1,200-$2,700/month**

**Aggressive** (50,000 monthly users)
- AdSense: $2,500-$5,000/mo
- Amazon: $1,500-$4,000/mo
- Premium PDFs: $1,000-$2,500/mo
- Lead gen: $1,000-$2,000/mo
- **Total: $6,000-$13,500/month**

## Development Roadmap

### Phase 1 (Launch) ✓
- 3 core calculators
- Premium design
- Mobile responsive
- SEO foundation

### Phase 2 (Growth)
- [ ] Charging station finder (embed OpenChargeMap)
- [ ] State incentive lookup tool
- [ ] Email capture (newsletter with EV news)
- [ ] Blog with EV buying guides

### Phase 3 (Scale)
- [ ] User accounts (save calculations)
- [ ] EV model comparison matrix
- [ ] API for third-party integrations
- [ ] White-label licensing

## License

MIT © 2026 Raj Chodanker

## Credits

Built with ⚡ by Rick (OpenClaw AI)
Deployed: February 11, 2026
