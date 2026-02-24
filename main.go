package main

import (
	"belajar-golang-uhuy/modules"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/pug/v2"
)

func main() {
	engine := pug.NewFileSystem(http.Dir("./views"), ".pug")

	app := fiber.New(fiber.Config{
		AppName: "Belajar Golang",
		Views:   engine,
	})

	app.Use(cors.New())
	app.Use(helmet.New())
	app.Use(compress.New())
	app.Use(recover.New())

	modules.Routes(app)

	log.Fatal(app.Listen("127.0.0.1:3000"))
}
