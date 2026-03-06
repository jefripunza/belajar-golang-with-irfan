package user

import (
	"belajar-golang-uhuy/function"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	RoleAdmin = "admin"
	RoleUser  = "user"
)

type User struct {
	ID        uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Username  string    `json:"username" gorm:"not null;unique"`
	Password  string    `json:"password" gorm:"not null"` // hash with bcrypt
	Role      string    `json:"role" gorm:"not null"`
	CreatedAt string    `json:"created_at" gorm:"autoCreateTime"`
}

func (s *User) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

func MapWithoutPassword(user *User) map[string]any {
	return map[string]any{
		"id":       user.ID,
		"name":     user.Name,
		"username": user.Username,
		"role":     user.Role,
	}
}

func Seed(db *gorm.DB) {
	var count int64
	db.Model(&User{}).Count(&count)

	if count == 0 {
		stats := []User{
			{
				Name:     "Admin",
				Username: "admin",
				Password: function.EncryptPassword("admin"), // hash with bcrypt
				Role:     RoleAdmin,
			},
		}

		for _, s := range stats {
			db.Create(&s)
		}
	}
}
