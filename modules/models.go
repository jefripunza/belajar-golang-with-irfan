package modules

import (
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/feature"
	"belajar-golang-uhuy/modules/testimony"
	"belajar-golang-uhuy/modules/user"

	"gorm.io/gorm"
)

func Models() []interface{} {
	return []interface{}{
		&user.User{},
		&testimony.Testimony{},
		&analytic.AnalyticStats{},
		&feature.Feature{},
	}
}

func SeedAll(db *gorm.DB) {
	user.Seed(db)
	testimony.Seed(db)
	analytic.Seed(db)
	feature.Seed(db)
}
