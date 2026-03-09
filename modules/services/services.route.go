package services

import "github.com/gofiber/fiber/v2"

func Route(api fiber.Router) {
	// Public — single endpoint for ServicesPage
	api.Get("", GetAll)

	// Services
	api.Get("/list", GetServices)
	api.Post("/list", CreateService)
	api.Put("/list/reorder", ReorderServices) // ← reorder HARUS sebelum /:id
	api.Put("/list/:id", UpdateService)
	api.Patch("/list/:id/publish", ToggleServicePublish)
	api.Delete("/list/:id", DeleteService)

	// Process Steps
	api.Get("/process", GetProcess)
	api.Post("/process", CreateProcessStep)
	api.Put("/process/reorder", ReorderProcess) // ← reorder HARUS sebelum /:id
	api.Put("/process/:id", UpdateProcessStep)
	api.Delete("/process/:id", DeleteProcessStep)

	// Pricing Plans
	api.Get("/plans", GetPlans)
	api.Post("/plans", CreatePlan)
	api.Put("/plans/reorder", ReorderPlans) // ← reorder HARUS sebelum /:id
	api.Put("/plans/:id", UpdatePlan)
	api.Patch("/plans/:id/publish", TogglePlanPublish)
	api.Delete("/plans/:id", DeletePlan)
}
