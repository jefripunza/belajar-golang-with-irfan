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
