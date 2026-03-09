package about

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ─── Team Member ──────────────────────────────────────────────────────────────

type TeamMember struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Name  string    `json:"name"  gorm:"not null"`
	Role  string    `json:"role"  gorm:"not null"`
	Emoji string    `json:"emoji" gorm:"not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (t *TeamMember) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

// ─── Company Value ────────────────────────────────────────────────────────────

type CompanyValue struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Icon  string    `json:"icon"  gorm:"not null"`
	Title string    `json:"title" gorm:"not null"`
	Desc  string    `json:"desc"  gorm:"type:text;not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (v *CompanyValue) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

// ─── Company Stat ─────────────────────────────────────────────────────────────

type CompanyStat struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Value string    `json:"value" gorm:"not null"`
	Label string    `json:"label" gorm:"not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (s *CompanyStat) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

// ─── Page Content (Hero + Story) ─────────────────────────────────────────────
// Disimpan sebagai key-value agar fleksibel

type PageContent struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Key   string    `json:"key"   gorm:"uniqueIndex;not null"`
	Value string    `json:"value" gorm:"type:text;not null"`
}

func (p *PageContent) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

func Seed(db *gorm.DB) {
	seedTeam(db)
	seedValues(db)
	seedStats(db)
	seedContent(db)
}

func seedTeam(db *gorm.DB) {
	var count int64
	db.Model(&TeamMember{}).Count(&count)
	if count > 0 {
		return
	}
	members := []TeamMember{
		{Name: "Alice Johnson", Role: "CEO & Founder", Emoji: "👩‍💼", Order: 1},
		{Name: "Brian Chen", Role: "CTO", Emoji: "👨‍💻", Order: 2},
		{Name: "Sara Malik", Role: "Head of Design", Emoji: "👩‍🎨", Order: 3},
		{Name: "David Park", Role: "Lead Engineer", Emoji: "👨‍🔧", Order: 4},
	}
	for _, m := range members {
		db.Create(&m)
	}
}

func seedValues(db *gorm.DB) {
	var count int64
	db.Model(&CompanyValue{}).Count(&count)
	if count > 0 {
		return
	}
	values := []CompanyValue{
		{Icon: "🎯", Title: "Mission-Driven", Desc: "Everything we do is guided by our mission to make technology accessible for everyone.", Order: 1},
		{Icon: "🤝", Title: "People First", Desc: "We believe great products are built by empowered, happy, and diverse teams.", Order: 2},
		{Icon: "🌱", Title: "Always Growing", Desc: "We embrace learning, iteration, and continuous improvement in everything we do.", Order: 3},
		{Icon: "🌍", Title: "Global Impact", Desc: "Our solutions reach 150+ countries, creating real change at a global scale.", Order: 4},
	}
	for _, v := range values {
		db.Create(&v)
	}
}

func seedStats(db *gorm.DB) {
	var count int64
	db.Model(&CompanyStat{}).Count(&count)
	if count > 0 {
		return
	}
	stats := []CompanyStat{
		{Value: "2020", Label: "Founded", Order: 1},
		{Value: "50+", Label: "Team Members", Order: 2},
		{Value: "10K+", Label: "Customers", Order: 3},
		{Value: "150+", Label: "Countries", Order: 4},
	}
	for _, s := range stats {
		db.Create(&s)
	}
}

func seedContent(db *gorm.DB) {
	var count int64
	db.Model(&PageContent{}).Count(&count)
	if count > 0 {
		return
	}
	contents := []PageContent{
		{Key: "hero_badge", Value: "About Us"},
		{Key: "hero_headline", Value: "We're building the future,"},
		{Key: "hero_headline_highlight", Value: "together"},
		{Key: "hero_subtext", Value: "Nexora was founded in 2020 with a simple belief — great software should be beautiful, fast, and accessible to everyone. Today we serve thousands of teams worldwide."},
		{Key: "story_paragraph1", Value: "It started in a small apartment in Jakarta — two developers frustrated with clunky, overpriced tools that got in the way of creativity. We knew there had to be a better way."},
		{Key: "story_paragraph2", Value: "So we built it. Nexora launched in 2020 as a simple design tool and quickly grew into a full platform trusted by startups, agencies, and Fortune 500 companies alike."},
		{Key: "story_paragraph3", Value: "Today, our team of 50+ spans 12 countries — united by a shared passion for craft, quality, and making our customers successful."},
	}
	for _, c := range contents {
		db.Create(&c)
	}
}
