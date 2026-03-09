package blog

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ─── Post ─────────────────────────────────────────────────────────────────────

type Post struct {
	ID          uuid.UUID `json:"id"          gorm:"type:char(36);primaryKey"`
	Emoji       string    `json:"emoji"       gorm:"not null"`
	Category    string    `json:"category"    gorm:"not null"`
	Badge       string    `json:"badge"       gorm:"not null"`
	Title       string    `json:"title"       gorm:"not null"`
	Desc        string    `json:"desc"        gorm:"type:text;not null"`
	Author      string    `json:"author"      gorm:"not null"`
	AuthorEmoji string    `json:"author_emoji" gorm:"not null"`
	Role        string    `json:"role"        gorm:"default:''"`
	Date        string    `json:"date"        gorm:"not null"`
	ReadTime    string    `json:"read_time"   gorm:"not null"`
	Color       string    `json:"color"       gorm:"not null"`
	Featured    bool      `json:"featured"    gorm:"default:false"`
	Published   bool      `json:"published"   gorm:"default:false"`
}

func (p *Post) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ─── Author ───────────────────────────────────────────────────────────────────

type Author struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Name  string    `json:"name"  gorm:"not null"`
	Role  string    `json:"role"  gorm:"not null"`
	Emoji string    `json:"emoji" gorm:"not null"`
}

func (a *Author) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

// ─── Topic ────────────────────────────────────────────────────────────────────

type Topic struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Label string    `json:"label" gorm:"not null;uniqueIndex"`
	Order int       `json:"order" gorm:"default:0"`
}

func (t *Topic) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

func Seed(db *gorm.DB) {
	seedAuthors(db)
	seedPosts(db)
	seedTopics(db)
}

func seedAuthors(db *gorm.DB) {
	var count int64
	db.Model(&Author{}).Count(&count)
	if count > 0 {
		return
	}
	authors := []Author{
		{Name: "Alice Johnson", Role: "CEO & Founder", Emoji: "👩‍💼"},
		{Name: "Brian Chen", Role: "CTO", Emoji: "👨‍💻"},
		{Name: "Sara Malik", Role: "Head of Design", Emoji: "👩‍🎨"},
		{Name: "David Park", Role: "Lead Engineer", Emoji: "👨‍🔧"},
	}
	for _, a := range authors {
		db.Create(&a)
	}
}

func seedPosts(db *gorm.DB) {
	var count int64
	db.Model(&Post{}).Count(&count)
	if count > 0 {
		return
	}
	posts := []Post{
		{Emoji: "🤖", Category: "AI & Tech", Badge: "bg-violet-100 text-violet-700", Title: "How AI is Reshaping the Future of Web Development in 2026", Desc: "From AI-powered code generation to intelligent design systems — explore how artificial intelligence is fundamentally changing how we build for the web.", Author: "Brian Chen", AuthorEmoji: "👨‍💻", Role: "CTO, Nexora", Date: "March 1, 2026", ReadTime: "8 min read", Color: "from-violet-50 to-indigo-50", Featured: true, Published: true},
		{Emoji: "⚡", Category: "Performance", Badge: "bg-amber-100 text-amber-700", Title: "10 Ways to Dramatically Speed Up Your React App", Desc: "Practical techniques to optimize rendering, reduce bundle size, and improve Core Web Vitals.", Author: "David Park", AuthorEmoji: "👨‍🔧", Role: "", Date: "Feb 24, 2026", ReadTime: "6 min read", Color: "from-amber-50 to-orange-50", Featured: false, Published: true},
		{Emoji: "🎨", Category: "Design", Badge: "bg-pink-100 text-pink-700", Title: "Design Systems: Why Every Team Needs One", Desc: "How a well-crafted design system saves time, reduces inconsistency, and scales your product.", Author: "Sara Malik", AuthorEmoji: "👩‍🎨", Role: "", Date: "Feb 18, 2026", ReadTime: "5 min read", Color: "from-pink-50 to-rose-50", Featured: false, Published: true},
		{Emoji: "🔒", Category: "Security", Badge: "bg-slate-100 text-slate-700", Title: "The OWASP Top 10: What Every Developer Must Know", Desc: "A practical guide to the most critical web application security risks and how to prevent them.", Author: "Alice Johnson", AuthorEmoji: "👩‍💼", Role: "", Date: "Feb 12, 2026", ReadTime: "7 min read", Color: "from-slate-50 to-gray-50", Featured: false, Published: true},
		{Emoji: "☁️", Category: "DevOps", Badge: "bg-blue-100 text-blue-700", Title: "Docker + Kubernetes: A Beginner's Survival Guide", Desc: "Cut through the complexity — learn how to containerize and orchestrate your apps step by step.", Author: "Brian Chen", AuthorEmoji: "👨‍💻", Role: "", Date: "Feb 5, 2026", ReadTime: "9 min read", Color: "from-blue-50 to-cyan-50", Featured: false, Published: true},
		{Emoji: "📱", Category: "Mobile", Badge: "bg-emerald-100 text-emerald-700", Title: "React Native vs Flutter: Which Should You Pick in 2026?", Desc: "An honest, up-to-date comparison to help you make the right choice for your next mobile app.", Author: "David Park", AuthorEmoji: "👨‍🔧", Role: "", Date: "Jan 28, 2026", ReadTime: "6 min read", Color: "from-emerald-50 to-teal-50", Featured: false, Published: true},
		{Emoji: "🚀", Category: "Startup", Badge: "bg-rose-100 text-rose-700", Title: "MVP to Product-Market Fit: Lessons from 3 Years of Building", Desc: "What we learned shipping dozens of MVPs — the mistakes, the wins, and what actually matters.", Author: "Alice Johnson", AuthorEmoji: "👩‍💼", Role: "", Date: "Jan 20, 2026", ReadTime: "10 min read", Color: "from-rose-50 to-pink-50", Featured: false, Published: false},
	}
	for _, p := range posts {
		db.Create(&p)
	}
}

func seedTopics(db *gorm.DB) {
	var count int64
	db.Model(&Topic{}).Count(&count)
	if count > 0 {
		return
	}
	labels := []string{"React", "TypeScript", "UI/UX", "Node.js", "Cloud", "AI", "Mobile", "Security", "Startup", "DevOps"}
	for i, l := range labels {
		db.Create(&Topic{Label: l, Order: i + 1})
	}
}
