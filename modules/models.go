package modules

import (
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/testimony"

	"gorm.io/gorm"
)

func Models() []interface{} {
	return []interface{}{
		&testimony.Testimony{},
		&analytic.AnalyticStats{},
	}
}

func SeedAll(db *gorm.DB) {
	testimony.Seed(db)
	analytic.Seed(db)
}
