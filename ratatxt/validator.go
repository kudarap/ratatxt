package ratatxt

import v10 "github.com/go-playground/validator/v10"

var validator = v10.New()

func validateParams(param interface{}) error {
	return validator.Struct(param)
}

func sanitizeParams(param interface{}) {

}

func validatedRequiredParams(param interface{}) {

}
