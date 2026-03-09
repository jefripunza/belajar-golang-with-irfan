package services

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ─── Service ──────────────────────────────────────────────────────────────────

type Service struct {
	ID        uuid.UUID `json:"id"        gorm:"type:char(36);primaryKey"`
	Icon      string    `json:"icon"      gorm:"not null"`
	Title     string    `json:"title"     gorm:"not null"`
	Desc      string    `json:"desc"      gorm:"type:text;not null"`
	Features  string    `json:"features"  gorm:"type:text"` // comma-separated
	Color     string    `json:"color"     gorm:"not null"`
	Border    string    `json:"border"    gorm:"not null"`
	Badge     string    `json:"badge"     gorm:"not null"`
	Published bool      `json:"published" gorm:"default:false"`
	Order     int       `json:"order"     gorm:"default:0"`
}

func (s *Service) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

// ─── Process Step ─────────────────────────────────────────────────────────────

type ProcessStep struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Step  string    `json:"step"  gorm:"not null"` // "01", "02", ...
	Title string    `json:"title" gorm:"not null"`
	Desc  string    `json:"desc"  gorm:"type:text;not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (p *ProcessStep) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ─── Pricing Plan ─────────────────────────────────────────────────────────────

type PricingPlan struct {
	ID        uuid.UUID `json:"id"        gorm:"type:char(36);primaryKey"`
	Name      string    `json:"name"      gorm:"not null"`
	Price     string    `json:"price"     gorm:"not null"`
	Period    string    `json:"period"    gorm:"not null"`
	Desc      string    `json:"desc"      gorm:"type:text;not null"`
	Features  string    `json:"features"  gorm:"type:text"` // comma-separated
	Cta       string    `json:"cta"       gorm:"not null"`
	Highlight bool      `json:"highlight" gorm:"default:false"`
	Published bool      `json:"published" gorm:"default:false"`
	Order     int       `json:"order"     gorm:"default:0"`
}

func (p *PricingPlan) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

func Seed(db *gorm.DB) {
	seedServices(db)
	seedProcess(db)
	seedPricing(db)
}

func seedServices(db *gorm.DB) {
	var count int64
	db.Model(&Service{}).Count(&count)
	if count > 0 {
		return
	}
	items := []Service{
		{Icon: "🎨", Title: "UI/UX Design", Desc: "We craft intuitive, beautiful interfaces that users love. From wireframes to polished prototypes.", Features: "User Research,Wireframing,Prototyping,Design System", Color: "from-pink-50 to-rose-50", Border: "hover:border-pink-200", Badge: "bg-pink-100 text-pink-700", Published: true, Order: 1},
		{Icon: "💻", Title: "Web Development", Desc: "Modern, fast, and scalable web applications built with the latest technologies.", Features: "React / Next.js,TypeScript,REST & GraphQL,Performance Optimization", Color: "from-violet-50 to-indigo-50", Border: "hover:border-violet-200", Badge: "bg-violet-100 text-violet-700", Published: true, Order: 2},
		{Icon: "📱", Title: "Mobile Apps", Desc: "Cross-platform mobile experiences that feel native on iOS and Android.", Features: "React Native,iOS & Android,Push Notifications,Offline Support", Color: "from-blue-50 to-cyan-50", Border: "hover:border-blue-200", Badge: "bg-blue-100 text-blue-700", Published: true, Order: 3},
		{Icon: "☁️", Title: "Cloud & DevOps", Desc: "Reliable infrastructure, CI/CD pipelines, and cloud solutions that scale with you.", Features: "AWS / GCP / Azure,Docker & Kubernetes,CI/CD Pipelines,Monitoring", Color: "from-emerald-50 to-teal-50", Border: "hover:border-emerald-200", Badge: "bg-emerald-100 text-emerald-700", Published: true, Order: 4},
		{Icon: "🤖", Title: "AI Integration", Desc: "Supercharge your product with AI — from chatbots to intelligent data pipelines.", Features: "LLM Integration,Custom ML Models,Data Pipelines,AI Chatbots", Color: "from-amber-50 to-orange-50", Border: "hover:border-amber-200", Badge: "bg-amber-100 text-amber-700", Published: true, Order: 5},
		{Icon: "🔒", Title: "Security & Compliance", Desc: "Keep your product and users safe with enterprise-grade security audits and solutions.", Features: "Penetration Testing,GDPR Compliance,Auth & SSO,Security Audits", Color: "from-slate-50 to-gray-50", Border: "hover:border-slate-200", Badge: "bg-slate-100 text-slate-700", Published: false, Order: 6},
	}
	for _, s := range items {
		db.Create(&s)
	}
}

func seedProcess(db *gorm.DB) {
	var count int64
	db.Model(&ProcessStep{}).Count(&count)
	if count > 0 {
		return
	}
	steps := []ProcessStep{
		{Step: "01", Title: "Discovery", Desc: "We learn about your goals, users, and technical requirements.", Order: 1},
		{Step: "02", Title: "Strategy", Desc: "We define scope, timelines, and the best approach for your project.", Order: 2},
		{Step: "03", Title: "Build", Desc: "Our team designs and develops your product with full transparency.", Order: 3},
		{Step: "04", Title: "Launch", Desc: "We ship, monitor, and iterate — ensuring a smooth go-live.", Order: 4},
	}
	for _, s := range steps {
		db.Create(&s)
	}
}

func seedPricing(db *gorm.DB) {
	var count int64
	db.Model(&PricingPlan{}).Count(&count)
	if count > 0 {
		return
	}
	plans := []PricingPlan{
		{Name: "Starter", Price: "$499", Period: "/project", Desc: "Perfect for small businesses and MVPs.", Features: "1 Service Included,Up to 3 Revisions,2 Week Delivery,Email Support", Cta: "Get Started", Highlight: false, Published: true, Order: 1},
		{Name: "Growth", Price: "$1,499", Period: "/month", Desc: "For teams that need ongoing support.", Features: "3 Services Included,Unlimited Revisions,Priority Delivery,Slack Support,Monthly Reports", Cta: "Start Free Trial", Highlight: true, Published: true, Order: 2},
		{Name: "Enterprise", Price: "Custom", Period: "", Desc: "Tailored solutions for large organizations.", Features: "All Services,Dedicated Team,SLA Guarantee,24/7 Support,On-site Visits", Cta: "Contact Sales", Highlight: false, Published: true, Order: 3},
	}
	for _, p := range plans {
		db.Create(&p)
	}
}
