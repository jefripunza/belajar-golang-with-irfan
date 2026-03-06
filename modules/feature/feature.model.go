package feature

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Feature struct {
	ID          uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Icon        string    `json:"icon" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text;not null"`
}

func (f *Feature) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}

func Seed(db *gorm.DB) {
	var count int64
	db.Model(&Feature{}).Count(&count)

	if count == 0 {
		feature := []Feature{
			{
				Title:       "Fast Performance",
				Icon:        "⚡",
				Description: "Optimized for speed and efficiency across all devices.",
			},
			{
				Title:       "Secure Encryption",
				Icon:        "🔐",
				Description: "Built-in encryption for secure data storage and transmission.",
			},
			{
				Title:       "User-Friendly Interface",
				Icon:        "🎉",
				Description: "Simple and intuitive interface for easy navigation and interaction.",
			},
			{
				Title:       "Real-time Updates",
				Icon:        "📡",
				Description: "Instant updates and notifications for real-time information.",
			},
			{
				Title:       "Cross-Platform Compatibility",
				Icon:        "🌐",
				Description: "Works seamlessly on various platforms, including web, mobile, and desktop.",
			},
			{
				Title:       "Scalability and Performance",
				Icon:        "🚀",
				Description: "Built-in scalability and performance optimization for optimal performance.",
			},
		}
		for _, s := range feature {
			db.Create(&s)
		}
	}
}
