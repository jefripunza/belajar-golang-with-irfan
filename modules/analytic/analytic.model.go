package analytic

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AnalyticStats struct {
	ID    uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Label string    `json:"label" gorm:"not null"`
	Value string    `json:"value" gorm:"not null"`
}

func (s *AnalyticStats) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

func Seed(db *gorm.DB) {
	var count int64
	db.Model(&AnalyticStats{}).Count(&count)

	if count == 0 {
		stats := []AnalyticStats{
			{
				Label: "Happy Clients",
				Value: "10K+",
			},
			{
				Label: "Uptime",
				Value: "99.9%",
			},
			{
				Label: "Countries",
				Value: "150+",
			},
			{
				Label: "Support",
				Value: "24/7",
			},
		}

		for _, s := range stats {
			db.Create(&s)
		}
	}
}
