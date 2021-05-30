package mail

import (
	"embed"
	"html/template"
)

//go:embed *.html
var tmpls embed.FS

// Templates embedded mail templates.
var Templates *template.Template

func init() {
	t, err := template.ParseFS(tmpls, "*")
	if err != nil {
		panic(err)
	}
	Templates = t
}
