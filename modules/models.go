package modules

import (
	"belajar-golang-uhuy/modules/testimony"

	"gorm.io/gorm"
)

func Models() []interface{} {
	return []interface{}{
		&testimony.Testimony{},
	}
}

func SeedAll(db *gorm.DB) {
	testimony.Seed(db)
}
