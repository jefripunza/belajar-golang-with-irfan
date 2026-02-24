package testimony

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Testimony struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Position  string    `json:"position" gorm:"not null"`
	Content   string    `json:"content" gorm:"type:text;not null"`
	Rating    int       `json:"rating" gorm:"default:5;check:rating >= 1 AND rating <= 5"`
	Avatar    string    `json:"avatar" gorm:"size:1"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (s *Testimony) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

func Seed(db *gorm.DB) {
	var count int64
	db.Model(&Testimony{}).Count(&count)

	if count == 0 {
		testimonials := []Testimony{
			{
				Name:     "Alex Chen",
				Position: "Senior Backend Engineer",
				Content:  "Go Fiber has completely transformed how we build backend services. The performance gains are incredible, and the API is so intuitive.",
				Rating:   5,
				Avatar:   "A",
			},
			{
				Name:     "Sarah Johnson",
				Position: "CTO at TechFlow",
				Content:  "Migrating from Express.js to Go Fiber was seamless. We saw 10x improvement in response times and significantly lower resource usage.",
				Rating:   5,
				Avatar:   "S",
			},
			{
				Name:     "Marcus Rivera",
				Position: "Full Stack Developer",
				Content:  "The middleware ecosystem is fantastic. We were able to set up authentication, logging, and rate limiting in minutes instead of hours.",
				Rating:   5,
				Avatar:   "M",
			},
		}

		for _, t := range testimonials {
			db.Create(&t)
		}
	}
}
