package http

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"strconv"
	"strings"

	"github.com/gorilla/schema"
	"github.com/kudarap/ratatxt/ratatxt"
)

const defaultPageLimit = 10

// searchOptsFromReq extract filter values from query params with user id from context.
func searchOptsFromReq(r *http.Request, filter interface{}) (*ratatxt.SearchOpts, error) {
	o, err := searchOptsFromURL(r.URL, filter)
	if err != nil {
		return nil, err
	}

	o.UserID = userIDFrom(r.Context())
	return o, nil
}

// searchOptsFromURL transforms query params into search options.
func searchOptsFromURL(u *url.URL, filter interface{}) (*ratatxt.SearchOpts, error) {
	opts := ratatxt.SearchOpts{}
	get := u.Query().Get

	// Set keyword
	opts.Keyword = get("q")

	// Set pagination.
	opts.Page, _ = strconv.Atoi(get("page"))
	opts.Limit, _ = strconv.Atoi(get("limit"))
	if opts.Limit == 0 {
		opts.Limit = defaultPageLimit
	}

	// Sets sort.
	opts.Sort, opts.Desc = parseSort(get("sort"))

	// Set filter.
	if err := searchOptsFilter(u, filter); err != nil {
		return nil, err
	}
	opts.Filter = filter

	return &opts, nil
}

const sortDescSuffix = ":desc"

func parseSort(sortStr string) (field string, isDesc bool) {
	// Get sort field.
	s := strings.Split(sortStr, ":")
	if len(s) == 0 {
		return
	}
	field = s[0]

	// Detect sorting order.
	if strings.HasSuffix(sortStr, sortDescSuffix) {
		isDesc = true
		return
	}

	return
}

const defaultFilterTag = "db"

// searchOptsFilter extract filter values from query params.
func searchOptsFilter(u *url.URL, filter interface{}) error {
	// Sets search filters.
	d := schema.NewDecoder()
	d.SetAliasTag(defaultFilterTag)
	d.IgnoreUnknownKeys(true)
	return d.Decode(filter, u.Query())
}

func hasQueryField(url *url.URL, key string) bool {
	_, ok := url.Query()[key]
	return ok
}

func parseForm(r *http.Request, form interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(form); err != nil {
		return fmt.Errorf("could not parse json form: %s", err)
	}

	return nil
}

func userIDFrom(ctx context.Context) (userID ratatxt.ID) {
	au := ratatxt.AuthFromContext(ctx)
	if au == nil {
		return
	}

	return au.UserID
}

func parseFormWithUserID(r *http.Request, form interface{}) error {
	if err := parseForm(r, form); err != nil {
		return err
	}
	setFilterUserID(r.Context(), form)
	return nil
}

const filterFieldUserID = "user_id"

// setFilterUserID sets user id if available from request context
// and user_id field exists on filter provided.
// Overrides user_id field on filter.
func setFilterUserID(ctx context.Context, filter interface{}) {
	rField := reflect.ValueOf(filter).Elem().FieldByName(filterFieldUserID)
	if !rField.IsValid() {
		return
	}

	rVal := reflect.ValueOf(userIDFrom(ctx))
	if rField.Type() != rVal.Type() {
		return
	}

	rField.Set(rVal)
	return
}
