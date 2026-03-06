package main

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/modules"
	"embed"
	"io/fs"
	"log"
	"mime"
	"path/filepath"
	"strings"

	_ "belajar-golang-uhuy/database" // init database

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

//go:embed dist/*
var embedDist embed.FS

func main() {
	app := fiber.New(fiber.Config{
		AppName:       "Belajar Golang",
		ServerHeader:  "Belajar Golang",
		Prefork:       false,
		StrictRouting: true,
		CaseSensitive: true,
		BodyLimit:     1024 * 1024 * 4, // MB
	})

	app.Use(cors.New())
	app.Use(helmet.New())
	app.Use(compress.New())
	app.Use(recover.New())

	// Serve embedded frontend (SPA / Single Page Application)
	distFS, _ := fs.Sub(embedDist, "dist")
	app.Use(func(c *fiber.Ctx) error {
		path := c.Path() // endpoint

		// skip API and backend routes
		skips := []string{"/api", "/socket.io", "/subscribe", "/icon", "/file", "/upload", "/ws", "/webhook"}
		for _, skip := range skips {
			if strings.HasPrefix(path, skip) {
				return c.Next() // skip to next middleware/handler / backend
			}
		}

		// try to serve the exact file / Frontend
		filePath := strings.TrimPrefix(path, "/") //= /index.html -> index.html
		if filePath == "" {
			filePath = "index.html"
		}
		data, err := fs.ReadFile(distFS, filePath) // /foo/bar -> foo/bar
		if err != nil {
			// SPA fallback: serve index.html for unknown routes
			data, err = fs.ReadFile(distFS, "index.html")
			if err != nil {
				return fiber.ErrNotFound
			}
			c.Set("Content-Type", "text/html; charset=utf-8")
			return c.Send(data) // handle on react-router
		}
		// set content type based on extension
		ext := filepath.Ext(filePath)
		if ct := mime.TypeByExtension(ext); ct != "" {
			c.Set("Content-Type", ct)
		}
		return c.Send(data) // selain index.html serve file disini
	})
	app.Use(logger.New()) // biarkan disini ...

	modules.Routes(app)

	// Global error handler for API
	app.Use(func(c *fiber.Ctx) error {
		return dto.NotFound(c, "endpoint not found", nil)
	})

	log.Fatal(app.Listen("127.0.0.1:3000"))
}
