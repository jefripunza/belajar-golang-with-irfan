package portfolio

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ─── Project ──────────────────────────────────────────────────────────────────

type Project struct {
	ID        uuid.UUID `json:"id"        gorm:"type:char(36);primaryKey"`
	Emoji     string    `json:"emoji"     gorm:"not null"`
	Title     string    `json:"title"     gorm:"not null"`
	Category  string    `json:"category"  gorm:"not null"`
	Desc      string    `json:"desc"      gorm:"type:text;not null"`
	Tags      string    `json:"tags"      gorm:"type:text"` // comma-separated
	Result    string    `json:"result"    gorm:"not null"`
	Color     string    `json:"color"     gorm:"not null"`
	Border    string    `json:"border"    gorm:"not null"`
	Badge     string    `json:"badge"     gorm:"not null"`
	Published bool      `json:"published" gorm:"default:false"`
	Order     int       `json:"order"     gorm:"default:0"`
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

type Testimonial struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Name  string    `json:"name"  gorm:"not null"`
	Role  string    `json:"role"  gorm:"not null"`
	Emoji string    `json:"emoji" gorm:"not null"`
	Text  string    `json:"text"  gorm:"type:text;not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (t *Testimonial) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

func Seed(db *gorm.DB) {
	seedProjects(db)
	seedTestimonials(db)
}

func seedProjects(db *gorm.DB) {
	var count int64
	db.Model(&Project{}).Count(&count)
	if count > 0 {
		return
	}
	projects := []Project{
		{
			Emoji: "🛒", Title: "ShopEase", Category: "E-Commerce",
			Desc:      "A full-featured online store with real-time inventory, payment gateway, and analytics dashboard.",
			Tags:      "React,Node.js,Stripe,PostgreSQL",
			Result:    "3x conversion rate increase",
			Color:     "from-pink-50 to-rose-50",
			Border:    "hover:border-pink-200",
			Badge:     "bg-pink-100 text-pink-700",
			Published: true, Order: 1,
		},
		{
			Emoji: "🏥", Title: "MediTrack", Category: "Healthcare",
			Desc:      "Patient management system with appointment scheduling, medical records, and telemedicine support.",
			Tags:      "Next.js,TypeScript,Prisma,AWS",
			Result:    "50% reduction in admin time",
			Color:     "from-emerald-50 to-teal-50",
			Border:    "hover:border-emerald-200",
			Badge:     "bg-emerald-100 text-emerald-700",
			Published: true, Order: 2,
		},
		{
			Emoji: "📊", Title: "FinSight", Category: "Fintech",
			Desc:      "Real-time financial analytics dashboard with AI-powered insights and automated reporting.",
			Tags:      "React,Python,OpenAI,Recharts",
			Result:    "$2M in decisions automated",
			Color:     "from-violet-50 to-indigo-50",
			Border:    "hover:border-violet-200",
			Badge:     "bg-violet-100 text-violet-700",
			Published: false, Order: 3,
		},
	}
	for _, p := range projects {
		db.Create(&p)
	}
}

func seedTestimonials(db *gorm.DB) {
	var count int64
	db.Model(&Testimonial{}).Count(&count)
	if count > 0 {
		return
	}
	testimonials := []Testimonial{
		{Name: "Sarah Kim", Role: "CEO, ShopEase", Emoji: "👩‍💼", Text: "Nexora completely transformed our online store. The new platform tripled our conversions in the first month.", Order: 1},
		{Name: "Dr. Reza Pratama", Role: "Director, MediTrack", Emoji: "👨‍⚕️", Text: "The team delivered ahead of schedule and the quality was outstanding. Our staff loves the new system.", Order: 2},
	}
	for _, t := range testimonials {
		db.Create(&t)
	}
}
