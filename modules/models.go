package modules

import (
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/feature"
	"belajar-golang-uhuy/modules/testimony"

	"gorm.io/gorm"
)

func Models() []interface{} {
	return []interface{}{
		&testimony.Testimony{},
		&analytic.AnalyticStats{},
		&feature.Feature{},
	}
}

func SeedAll(db *gorm.DB) {
	testimony.Seed(db)
	analytic.Seed(db)
	feature.Seed(db)
}
