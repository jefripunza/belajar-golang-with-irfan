package modules

import (
	"belajar-golang-uhuy/modules/about"
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/blog"
	"belajar-golang-uhuy/modules/contact"
	"belajar-golang-uhuy/modules/feature"
	"belajar-golang-uhuy/modules/portfolio"
	"belajar-golang-uhuy/modules/services"
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

		// Contact Page
		&contact.ContactCard{},
		&contact.OfficeHour{},
		&contact.ResponseTime{},
		&contact.Social{},
		&contact.FAQ{},

		// About Page
		&about.TeamMember{},
		&about.CompanyValue{},
		&about.CompanyStat{},
		&about.PageContent{},

		// Portfolio Page
		&portfolio.Project{},
		&portfolio.Testimonial{},

		// Services Page
		&services.Service{},
		&services.ProcessStep{},
		&services.PricingPlan{},

		//Blog Page
		&blog.Post{},
		&blog.Author{},
		&blog.Topic{},
	}
}

func SeedAll(db *gorm.DB) {
	user.Seed(db)
	testimony.Seed(db)
	analytic.Seed(db)
	feature.Seed(db)
	contact.Seed(db)
	about.Seed(db)
	portfolio.Seed(db)
	services.Seed(db)
	blog.Seed(db)
}
