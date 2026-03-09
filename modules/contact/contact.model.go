package contact

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ─── Contact Card ─────────────────────────────────────────────────────────────

type ContactCard struct {
	ID     uuid.UUID `json:"id"     gorm:"type:char(36);primaryKey"`
	Icon   string    `json:"icon"   gorm:"not null"`
	Title  string    `json:"title"  gorm:"not null"`
	Desc   string    `json:"desc"   gorm:"not null"`
	Value  string    `json:"value"  gorm:"not null"`
	Color  string    `json:"color"  gorm:"not null"`
	Border string    `json:"border" gorm:"not null"`
	Order  int       `json:"order"  gorm:"default:0"`
}

func (c *ContactCard) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// ─── Office Hour ──────────────────────────────────────────────────────────────

type OfficeHour struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Day   string    `json:"day"   gorm:"not null"`
	Time  string    `json:"time"  gorm:"not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (o *OfficeHour) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// ─── Response Time ────────────────────────────────────────────────────────────

type ResponseTime struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Label string    `json:"label" gorm:"not null"`
	Time  string    `json:"time"  gorm:"not null"`
	Bar   string    `json:"bar"   gorm:"not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (r *ResponseTime) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

// ─── Social Link ──────────────────────────────────────────────────────────────

type Social struct {
	ID    uuid.UUID `json:"id"    gorm:"type:char(36);primaryKey"`
	Name  string    `json:"name"  gorm:"not null"`
	Emoji string    `json:"emoji" gorm:"not null"`
	URL   string    `json:"url"   gorm:"not null"`
	Order int       `json:"order" gorm:"default:0"`
}

func (s *Social) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

type FAQ struct {
	ID       uuid.UUID `json:"id"       gorm:"type:char(36);primaryKey"`
	Question string    `json:"question" gorm:"not null"`
	Answer   string    `json:"answer"   gorm:"type:text;not null"`
	Order    int       `json:"order"    gorm:"default:0"`
}

func (f *FAQ) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

func Seed(db *gorm.DB) {
	seedContactCards(db)
	seedOfficeHours(db)
	seedResponseTimes(db)
	seedSocials(db)
	seedFAQs(db)
}

func seedContactCards(db *gorm.DB) {
	var count int64
	db.Model(&ContactCard{}).Count(&count)
	if count > 0 {
		return
	}
	cards := []ContactCard{
		{Icon: "📧", Title: "Email Us", Desc: "Our team will respond within 24 hours.", Value: "hello@nexora.com", Color: "from-violet-50 to-indigo-50", Border: "hover:border-violet-200", Order: 1},
		{Icon: "📞", Title: "Call Us", Desc: "Mon–Fri from 9am to 6pm WIB.", Value: "+62 812 3456 7890", Color: "from-emerald-50 to-teal-50", Border: "hover:border-emerald-200", Order: 2},
		{Icon: "📍", Title: "Visit Us", Desc: "Come say hello at our office.", Value: "Jakarta, Indonesia", Color: "from-amber-50 to-orange-50", Border: "hover:border-amber-200", Order: 3},
	}
	for _, c := range cards {
		db.Create(&c)
	}
}

func seedOfficeHours(db *gorm.DB) {
	var count int64
	db.Model(&OfficeHour{}).Count(&count)
	if count > 0 {
		return
	}
	hours := []OfficeHour{
		{Day: "Monday – Friday", Time: "09:00 – 18:00 WIB", Order: 1},
		{Day: "Saturday", Time: "10:00 – 14:00 WIB", Order: 2},
		{Day: "Sunday", Time: "Closed", Order: 3},
	}
	for _, h := range hours {
		db.Create(&h)
	}
}

func seedResponseTimes(db *gorm.DB) {
	var count int64
	db.Model(&ResponseTime{}).Count(&count)
	if count > 0 {
		return
	}
	times := []ResponseTime{
		{Label: "Email", Time: "Within 24 hours", Bar: "w-3/4", Order: 1},
		{Label: "Phone", Time: "Instant (office hours)", Bar: "w-full", Order: 2},
		{Label: "Live Chat", Time: "Under 5 minutes", Bar: "w-11/12", Order: 3},
	}
	for _, t := range times {
		db.Create(&t)
	}
}

func seedSocials(db *gorm.DB) {
	var count int64
	db.Model(&Social{}).Count(&count)
	if count > 0 {
		return
	}
	socials := []Social{
		{Name: "Twitter / X", Emoji: "🐦", URL: "#", Order: 1},
		{Name: "LinkedIn", Emoji: "💼", URL: "#", Order: 2},
		{Name: "GitHub", Emoji: "🐙", URL: "#", Order: 3},
		{Name: "Instagram", Emoji: "📸", URL: "#", Order: 4},
	}
	for _, s := range socials {
		db.Create(&s)
	}
}

func seedFAQs(db *gorm.DB) {
	var count int64
	db.Model(&FAQ{}).Count(&count)
	if count > 0 {
		return
	}
	faqs := []FAQ{
		{
			Question: "How quickly can you start my project?",
			Answer:   "We typically begin new projects within 1–2 weeks of signing. For urgent projects, we offer expedited onboarding.",
			Order:    1,
		},
		{
			Question: "Do you work with international clients?",
			Answer:   "Absolutely. We work with clients across 150+ countries and are comfortable with remote collaboration across time zones.",
			Order:    2,
		},
		{
			Question: "What is your typical project timeline?",
			Answer:   "It depends on scope. MVPs usually take 4–8 weeks. Larger products can range from 3–6 months. We'll give you a detailed estimate during discovery.",
			Order:    3,
		},
		{
			Question: "Do you offer post-launch support?",
			Answer:   "Yes! All projects include a 30-day post-launch support period. Ongoing retainers are available for continued development and maintenance.",
			Order:    4,
		},
	}
	for _, f := range faqs {
		db.Create(&f)
	}
}
