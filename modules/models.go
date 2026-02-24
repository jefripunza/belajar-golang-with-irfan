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
	var count int64
	db.Model(&testimony.Testimony{}).Count(&count)

	if count == 0 {
		testimonials := []testimony.Testimony{
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
