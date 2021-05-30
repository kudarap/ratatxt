package ratatxt

import (
	"strconv"
	"strings"
	"time"
)

// Stats errors types.
const (
	StatsErrNotFound Errors = iota + 6000
	StatsErrScopeStringRequired
	StatsErrScopeNotParsable
)

// Stats error definition
func init() {
	errorsText[StatsErrNotFound] = "stats not found"
	errorsText[StatsErrScopeStringRequired] = "stats scope required"
	errorsText[StatsErrScopeNotParsable] = "stats scope parse error"
}

// MessageStats represents messages counters.
type MessageStats struct {
	MessageStatsData
	OutboxStatsData
}

// MessageScore returns message stats score by scope and filter.
func (c *Core) MessageScore(dateScope string, filter *MessageFilter) (MessageStats, error) {
	var ms MessageStats
	ss, err := StatsScopeParse(dateScope)
	if err != nil {
		return ms, err
	}

	err = c.store.MessageStats(&ms, *ss, filter)
	return ms, err
}

// MessageStatsData represents message aggregation overtime.
type MessageStatsData struct {
	Scope  string `json:"scope"`
	Total  int    `json:"total"`
	Inbox  int    `json:"inbox"`
	Outbox int    `json:"outbox"`
}

// MessageGraph returns message stats graph by scope and filter.
func (c *Core) MessageGraph(dateScope string, filter *MessageFilter) ([]MessageStatsData, error) {
	ss, err := StatsScopeParse(dateScope)
	if err != nil {
		return nil, err
	}

	var mg []MessageStatsData
	err = c.store.MessageGraph(&mg, *ss, filter)
	if mg == nil {
		mg = []MessageStatsData{}
	}

	return mg, err
}

// OutboxStatsData represents outbox aggregation overtime.
type OutboxStatsData struct {
	Scope         string `json:"scope"`
	OutboxQueued  int    `json:"outbox_queued"`
	OutboxSending int    `json:"outbox_sending"`
	OutboxSent    int    `json:"outbox_sent"`
	OutboxFailed  int    `json:"outbox_failed"`
	OutboxError   int    `json:"outbox_error"`
}

// OutboxGraph returns outbox stats graph by scope and filter.
func (c *Core) OutboxGraph(dateScope string, filter *MessageFilter) ([]OutboxStatsData, error) {
	ss, err := StatsScopeParse(dateScope)
	if err != nil {
		return nil, err
	}

	var res []OutboxStatsData
	err = c.store.OutboxGraph(&res, *ss, filter)
	return res, nil
}

// StatsScopeUnit represents stats scope time unit.
type StatsScopeUnit uint

// Stats scope time unit.
const (
	StatsScopeUnitHour StatsScopeUnit = iota
	StatsScopeUnitDay
)

var statsScopeUnitFormats = []string{
	StatsScopeUnitHour: "03 PM",
	StatsScopeUnitDay:  "Jan 02",
}

// DateFormat returns date layout format of a scope unit.
func (u StatsScopeUnit) DateFormat() string {
	return statsScopeUnitFormats[u]
}

var statsScopeUnitSQLFormats = []string{
	StatsScopeUnitHour: "%Y-%m-%d %H",
	StatsScopeUnitDay:  "%Y-%m-%d",
}

// SQLDateFormat returns date SQL format of a scope unit.
func (u StatsScopeUnit) SQLDateFormat() string {
	return statsScopeUnitSQLFormats[u]
}

const hoursInDay = 24

// duration returns unit time duration.
func (u StatsScopeUnit) duration() time.Duration {
	d := time.Hour
	if u == StatsScopeUnitDay {
		d *= hoursInDay
	}

	return d
}

// StatsScope represents stats scope result.
type StatsScope struct {
	From, To time.Time
	Unit     StatsScopeUnit
	All      bool
}

const scopeCustomDateFormat = "20060102"

// StatsScopeParse parses scope string like 20200226-20200229-d as custom range
// and support scope templates like "last-8-h" and "last-7-d".
//
// use "all" to get everything.
func StatsScopeParse(scopeStr string) (scope *StatsScope, err error) {
	if strings.TrimSpace(scopeStr) == "" {
		err = StatsErrScopeStringRequired
		return
	}
	scopeStr = strings.ToLower(scopeStr)

	if scopeStr == "all" {
		return &StatsScope{
			Unit: StatsScopeUnitDay,
			All:  true,
		}, nil
	}

	// Try to parse using last keyword.
	if s := parseScopeUsingLastKeyword(scopeStr); s != nil {
		return s, nil
	}

	// Try to parse custom date range and only support day unit.
	s := strings.Split(scopeStr, "-")
	if len(s) < 3 || !strings.HasSuffix(scopeStr, "-d") {
		return nil, StatsErrScopeNotParsable
	}
	fromStr, toStr := s[0], s[1]

	from, err := time.Parse(scopeCustomDateFormat, fromStr)
	if err != nil {
		return nil, StatsErrScopeNotParsable
	}
	to, err := time.Parse(scopeCustomDateFormat, toStr)
	if err != nil {
		return nil, StatsErrScopeNotParsable
	}

	return &StatsScope{
		From: from,
		To:   to,
		Unit: StatsScopeUnitDay,
	}, nil
}

func parseScopeUsingLastKeyword(s string) (ss *StatsScope) {
	// Check format validity.
	if !strings.HasPrefix(s, "last-") {
		return
	}
	p := strings.Split(s, "-")
	if len(p) < 3 {
		return
	}

	// Check unit validity.
	u := p[2]
	if !strings.Contains("hd", u) {
		return
	}
	unit := StatsScopeUnitDay
	if u == "h" {
		unit = StatsScopeUnitHour
	}

	// Check length validity.
	length, err := strconv.Atoi(p[1])
	if err != nil {
		return
	}

	now := time.Now()
	return &StatsScope{
		From: now.Add(-(time.Duration(length) * unit.duration())),
		To:   now,
		Unit: unit,
	}
}
