package contact

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT CARD
// ═══════════════════════════════════════════════════════════════════════════════

func GetContactCards(c *fiber.Ctx) error {
	cards := make([]ContactCard, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&cards).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch contact cards", nil)
	}
	return dto.OK(c, "Success get contact cards", fiber.Map{"contact_cards": cards})
}

func CreateContactCard(c *fiber.Ctx) error {
	body := new(ContactCard)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Value == "" {
		return dto.BadRequest(c, "Title and value are required", nil)
	}

	// Auto order: append to end
	var maxOrder int
	variable.Db.Model(&ContactCard{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create contact card", nil)
	}
	return dto.Created(c, "Contact card created", fiber.Map{"contact_card": body})
}

func UpdateContactCard(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var card ContactCard
	if err := variable.Db.First(&card, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Contact card not found", nil)
	}

	body := new(ContactCard)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	card.Icon = body.Icon
	card.Title = body.Title
	card.Desc = body.Desc
	card.Value = body.Value
	card.Color = body.Color
	card.Border = body.Border

	if err := variable.Db.Save(&card).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update contact card", nil)
	}
	return dto.OK(c, "Contact card updated", fiber.Map{"contact_card": card})
}

func DeleteContactCard(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	if err := variable.Db.Delete(&ContactCard{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete contact card", nil)
	}
	return dto.OK(c, "Contact card deleted", nil)
}

func ReorderContactCards(c *fiber.Ctx) error {
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
		variable.Db.Model(&ContactCard{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Contact cards reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFFICE HOUR
// ═══════════════════════════════════════════════════════════════════════════════

func GetOfficeHours(c *fiber.Ctx) error {
	hours := make([]OfficeHour, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&hours).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch office hours", nil)
	}
	return dto.OK(c, "Success get office hours", fiber.Map{"office_hours": hours})
}

func CreateOfficeHour(c *fiber.Ctx) error {
	body := new(OfficeHour)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Day == "" || body.Time == "" {
		return dto.BadRequest(c, "Day and time are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&OfficeHour{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create office hour", nil)
	}
	return dto.Created(c, "Office hour created", fiber.Map{"office_hour": body})
}

func UpdateOfficeHour(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var hour OfficeHour
	if err := variable.Db.First(&hour, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Office hour not found", nil)
	}

	body := new(OfficeHour)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	hour.Day = body.Day
	hour.Time = body.Time

	if err := variable.Db.Save(&hour).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update office hour", nil)
	}
	return dto.OK(c, "Office hour updated", fiber.Map{"office_hour": hour})
}

func DeleteOfficeHour(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	if err := variable.Db.Delete(&OfficeHour{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete office hour", nil)
	}
	return dto.OK(c, "Office hour deleted", nil)
}

func ReorderOfficeHours(c *fiber.Ctx) error {
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
		variable.Db.Model(&OfficeHour{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Office hours reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE TIME
// ═══════════════════════════════════════════════════════════════════════════════

func GetResponseTimes(c *fiber.Ctx) error {
	times := make([]ResponseTime, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&times).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch response times", nil)
	}
	return dto.OK(c, "Success get response times", fiber.Map{"response_times": times})
}

func CreateResponseTime(c *fiber.Ctx) error {
	body := new(ResponseTime)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Label == "" || body.Time == "" {
		return dto.BadRequest(c, "Label and time are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&ResponseTime{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create response time", nil)
	}
	return dto.Created(c, "Response time created", fiber.Map{"response_time": body})
}

func UpdateResponseTime(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var rt ResponseTime
	if err := variable.Db.First(&rt, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Response time not found", nil)
	}

	body := new(ResponseTime)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	rt.Label = body.Label
	rt.Time = body.Time
	rt.Bar = body.Bar

	if err := variable.Db.Save(&rt).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update response time", nil)
	}
	return dto.OK(c, "Response time updated", fiber.Map{"response_time": rt})
}

func DeleteResponseTime(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	if err := variable.Db.Delete(&ResponseTime{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete response time", nil)
	}
	return dto.OK(c, "Response time deleted", nil)
}

func ReorderResponseTimes(c *fiber.Ctx) error {
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
		variable.Db.Model(&ResponseTime{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Response times reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOCIAL LINK
// ═══════════════════════════════════════════════════════════════════════════════

func GetSocials(c *fiber.Ctx) error {
	socials := make([]Social, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&socials).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch socials", nil)
	}
	return dto.OK(c, "Success get socials", fiber.Map{"socials": socials})
}

func CreateSocial(c *fiber.Ctx) error {
	body := new(Social)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Name == "" || body.URL == "" {
		return dto.BadRequest(c, "Name and URL are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&Social{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create social", nil)
	}
	return dto.Created(c, "Social created", fiber.Map{"social": body})
}

func UpdateSocial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var social Social
	if err := variable.Db.First(&social, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Social not found", nil)
	}

	body := new(Social)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	social.Name = body.Name
	social.Emoji = body.Emoji
	social.URL = body.URL

	if err := variable.Db.Save(&social).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update social", nil)
	}
	return dto.OK(c, "Social updated", fiber.Map{"social": social})
}

func DeleteSocial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	if err := variable.Db.Delete(&Social{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete social", nil)
	}
	return dto.OK(c, "Social deleted", nil)
}

func ReorderSocials(c *fiber.Ctx) error {
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
		variable.Db.Model(&Social{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Socials reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════════════

func GetFAQs(c *fiber.Ctx) error {
	faqs := make([]FAQ, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&faqs).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch FAQs", nil)
	}
	return dto.OK(c, "Success get FAQs", fiber.Map{"faqs": faqs})
}

func CreateFAQ(c *fiber.Ctx) error {
	body := new(FAQ)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Question == "" || body.Answer == "" {
		return dto.BadRequest(c, "Question and answer are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&FAQ{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create FAQ", nil)
	}
	return dto.Created(c, "FAQ created", fiber.Map{"faq": body})
}

func UpdateFAQ(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var faq FAQ
	if err := variable.Db.First(&faq, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "FAQ not found", nil)
	}

	body := new(FAQ)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	faq.Question = body.Question
	faq.Answer = body.Answer

	if err := variable.Db.Save(&faq).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update FAQ", nil)
	}
	return dto.OK(c, "FAQ updated", fiber.Map{"faq": faq})
}

func DeleteFAQ(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	if err := variable.Db.Delete(&FAQ{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete FAQ", nil)
	}
	return dto.OK(c, "FAQ deleted", nil)
}

func ReorderFAQs(c *fiber.Ctx) error {
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
		variable.Db.Model(&FAQ{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "FAQs reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL — single endpoint for ContactPage public fetch
// ═══════════════════════════════════════════════════════════════════════════════

func GetAll(c *fiber.Ctx) error {
	cards := make([]ContactCard, 0)
	hours := make([]OfficeHour, 0)
	times := make([]ResponseTime, 0)
	socials := make([]Social, 0)
	faqs := make([]FAQ, 0)

	variable.Db.Order("\"order\" asc").Find(&cards)
	variable.Db.Order("\"order\" asc").Find(&hours)
	variable.Db.Order("\"order\" asc").Find(&times)
	variable.Db.Order("\"order\" asc").Find(&socials)
	variable.Db.Order("\"order\" asc").Find(&faqs)

	return dto.OK(c, "Success get contact page data", fiber.Map{
		"contact_cards":  cards,
		"office_hours":   hours,
		"response_times": times,
		"socials":        socials,
		"faqs":           faqs,
	})
}
