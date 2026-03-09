package services

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ═══════════════════════════════════════════════════════════════════════════════
// ALL — single endpoint for public ServicesPage
// ═══════════════════════════════════════════════════════════════════════════════

func GetAll(c *fiber.Ctx) error {
	svcs := make([]Service, 0)
	steps := make([]ProcessStep, 0)
	plans := make([]PricingPlan, 0)

	variable.Db.Where("published = ?", true).Order("\"order\" asc").Find(&svcs)
	variable.Db.Order("\"order\" asc").Find(&steps)
	variable.Db.Where("published = ?", true).Order("\"order\" asc").Find(&plans)

	return dto.OK(c, "Success get services page data", fiber.Map{
		"services": svcs,
		"process":  steps,
		"plans":    plans,
	})
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

func GetServices(c *fiber.Ctx) error {
	svcs := make([]Service, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&svcs).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch services", nil)
	}
	return dto.OK(c, "Success get services", fiber.Map{"services": svcs})
}

func CreateService(c *fiber.Ctx) error {
	body := new(Service)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Desc == "" {
		return dto.BadRequest(c, "Title and desc are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&Service{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create service", nil)
	}
	return dto.Created(c, "Service created", fiber.Map{"service": body})
}

func UpdateService(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var svc Service
	if err := variable.Db.First(&svc, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Service not found", nil)
	}
	body := new(Service)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	svc.Icon = body.Icon
	svc.Title = body.Title
	svc.Desc = body.Desc
	svc.Features = body.Features
	svc.Color = body.Color
	svc.Border = body.Border
	svc.Badge = body.Badge
	svc.Published = body.Published

	if err := variable.Db.Save(&svc).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update service", nil)
	}
	return dto.OK(c, "Service updated", fiber.Map{"service": svc})
}

func ToggleServicePublish(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var svc Service
	if err := variable.Db.First(&svc, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Service not found", nil)
	}
	svc.Published = !svc.Published
	if err := variable.Db.Save(&svc).Error; err != nil {
		return dto.InternalServerError(c, "Failed to toggle publish", nil)
	}
	return dto.OK(c, "Publish toggled", fiber.Map{"service": svc})
}

func DeleteService(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Service{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete service", nil)
	}
	return dto.OK(c, "Service deleted", nil)
}

func ReorderServices(c *fiber.Ctx) error {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	for i, rawID := range body.IDs {
		id, err := uuid.Parse(rawID)
		if err != nil {
			continue
		}
		variable.Db.Model(&Service{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Services reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS STEP
// ═══════════════════════════════════════════════════════════════════════════════

func GetProcess(c *fiber.Ctx) error {
	steps := make([]ProcessStep, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&steps).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch process steps", nil)
	}
	return dto.OK(c, "Success get process", fiber.Map{"process": steps})
}

func CreateProcessStep(c *fiber.Ctx) error {
	body := new(ProcessStep)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Desc == "" {
		return dto.BadRequest(c, "Title and desc are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&ProcessStep{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create process step", nil)
	}
	return dto.Created(c, "Process step created", fiber.Map{"step": body})
}

func UpdateProcessStep(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var step ProcessStep
	if err := variable.Db.First(&step, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Process step not found", nil)
	}
	body := new(ProcessStep)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	step.Step = body.Step
	step.Title = body.Title
	step.Desc = body.Desc

	if err := variable.Db.Save(&step).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update process step", nil)
	}
	return dto.OK(c, "Process step updated", fiber.Map{"step": step})
}

func DeleteProcessStep(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&ProcessStep{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete process step", nil)
	}
	return dto.OK(c, "Process step deleted", nil)
}

func ReorderProcess(c *fiber.Ctx) error {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	for i, rawID := range body.IDs {
		id, err := uuid.Parse(rawID)
		if err != nil {
			continue
		}
		variable.Db.Model(&ProcessStep{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Process reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING PLAN
// ═══════════════════════════════════════════════════════════════════════════════

func GetPlans(c *fiber.Ctx) error {
	plans := make([]PricingPlan, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&plans).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch pricing plans", nil)
	}
	return dto.OK(c, "Success get plans", fiber.Map{"plans": plans})
}

func CreatePlan(c *fiber.Ctx) error {
	body := new(PricingPlan)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Name == "" || body.Price == "" {
		return dto.BadRequest(c, "Name and price are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&PricingPlan{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create plan", nil)
	}
	return dto.Created(c, "Plan created", fiber.Map{"plan": body})
}

func UpdatePlan(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var plan PricingPlan
	if err := variable.Db.First(&plan, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Plan not found", nil)
	}
	body := new(PricingPlan)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	plan.Name = body.Name
	plan.Price = body.Price
	plan.Period = body.Period
	plan.Desc = body.Desc
	plan.Features = body.Features
	plan.Cta = body.Cta
	plan.Highlight = body.Highlight
	plan.Published = body.Published

	if err := variable.Db.Save(&plan).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update plan", nil)
	}
	return dto.OK(c, "Plan updated", fiber.Map{"plan": plan})
}

func TogglePlanPublish(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var plan PricingPlan
	if err := variable.Db.First(&plan, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Plan not found", nil)
	}
	plan.Published = !plan.Published
	if err := variable.Db.Save(&plan).Error; err != nil {
		return dto.InternalServerError(c, "Failed to toggle publish", nil)
	}
	return dto.OK(c, "Publish toggled", fiber.Map{"plan": plan})
}

func DeletePlan(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&PricingPlan{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete plan", nil)
	}
	return dto.OK(c, "Plan deleted", nil)
}

func ReorderPlans(c *fiber.Ctx) error {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	for i, rawID := range body.IDs {
		id, err := uuid.Parse(rawID)
		if err != nil {
			continue
		}
		variable.Db.Model(&PricingPlan{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Plans reordered", nil)
}
